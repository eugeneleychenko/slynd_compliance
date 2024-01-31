from flask import Flask, jsonify, make_response, request    
from openai import OpenAI
import os
from dotenv import load_dotenv
import json
from werkzeug.middleware.proxy_fix import ProxyFix
from asgiref.wsgi import WsgiToAsgi

app = Flask(__name__)
load_dotenv()
from flask_cors import CORS
# openai.api_key = os.getenv("OPENAI_API_KEY")
app = Flask(__name__)
CORS(app)

app.wsgi_app = ProxyFix(app.wsgi_app)  # Add ProxyFix middleware

client = OpenAI()

@app.route('/compliance_check', methods=['POST'])
def compliance_check():

    # Get JSON data from the request
    data = request.get_json()
    caption = data.get('caption')
    extracted_text = data.get('creativeCopy')  # Assuming 'extracted_text' corresponds to 'creativeCopy' based on context
    dos = data.get('FDA_Do')  # Assuming 'dos' corresponds to 'FDA_Do' based on context
    donts = data.get('FDA_dont')  # Assuming 'donts' corresponds to 'FDA_dont' based on context
    onbrand = data.get('on_brand_claims')  # Assuming 'onbrand' corresponds to 'on_brand_claims' based on context
    suzannes_rules_1 = data.get('s1')  # Assuming 'suzannes_rules_1' corresponds to 's1' based on context
    suzannes_rules_2 = data.get('s2')  # Assuming 'suzannes_rules_2' corresponds to 's2' based on context
    iri_input = data.get('iri')  # Assuming 'iri_input' corresponds to 'iri' based on context
    suzannes_rules_3 = data.get('s3')  # Assuming 'suzannes_rules_3' corresponds to 's3' based on context
    rule_exceptions = data.get('rule_exceptions')

    system_message = """
    You are an assistant with expertise in pharmaceutical marketing compliance. Your task is to evaluate a social media post for the drug Slynd (an estrogen-free birth control pill), 
    ensuring it adheres to FDA regulations, the client's branding, and specific drug claims allowed. Here's how to proceed:

    ### Steps for Evaluation:

    1. **Review Post Content**: Examine the Caption and Extracted Text from the social media post.
    2. **Cross-reference FDA Guidelines**: Match the post content against the FDA's list of Do's and Don'ts. Do's mean that if the post does include those things, then it IS COMPLIANT. Dont's means that if the post includes those things it is NOT COMPLIANT.
    3. **Check Brand Alignment**: Ensure the language is consistent with the client's On Brand guidelines.
    4. **Verify Claims**: Confirm that the claims made are within the allowed Branded and Allowable Claims as per the Slynd handbook.
    5. **Detailed Assessment**: Provide a compliance assessment, citing specific guidelines sections (e.g., Do's, Don'ts, On Brand) for each non-compliant point.
    6. 
 
    
    """
    
    user_message = f"""
    ### Post Content Variables:
    - `Caption`: {caption}
    - `Extracted Text`: {extracted_text}
    
    
~~
   
    ### Guidelines Reference:
    - `FDA Do's and Don'ts`: A list of regulatory guidelines.
    - `On Brand`: Client-specific branding guidelines.
    - `Branded and Allowable Claims`: Claims allowed for Slynd, as per the handbook.
    
    Do's: {dos}\\n\\n
    
    Don'ts: {donts}\\n\\n
    
    On Brand: {onbrand}\\n\\n 
    
    Branded: {suzannes_rules_1}\\n\\n
    
    Allowable Claims: {suzannes_rules_3}\\n\\n\\n, 
    
    ~~~
    ### Output Format:
Your response should be structured as a JSON array of objects, each representing a non-compliant issue. Only if you are sure that there is an issue, then include it. Otherwise be more forgiving. For multiple issues, include multiple objects within the array. Here's the structure to follow:

```json
{{
  "results": [
    {{
      "non_compliant_statement": "Example text from the post",
      "rule_broken": "Specific rule from the guidelines",
      "section": "The guideline section (e.g., Do's, Don'ts, On Brand)",
      "exception": 0,
      "certainty": "A number between 0 and 100, of how certain you are that this post statement is not compliant. Closer to 0 means NOT VERY SURE. Closer to 100 means you are very certain that this feedback is for a non-compliant post." ,
      "certainty_reason": "Reason for the certainty number. You can cite rules, post content, or anything else for your justification. This should be at maximium 3 sentences."
    }}
  ]
}}
```

### Additional Instructions:
- If the post is fully compliant, your JSON array should be empty.
- Provide context or a brief explanation for why a statement is non-compliant, if not immediately obvious from the rule or section cited.
- In cases of ambiguity or errors in the guidelines or post content, note these as a separate entry in your JSON output, specifying the nature of the ambiguity or error.

    
    """
    
    
    response = client.chat.completions.create(
        model="gpt-4-turbo-preview",
        # model="gpt-3.5-turbo-1106",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_message}
        ],
        response_format={ "type": "json_object" },
        temperature=0
    )
    
      # Print the messages sent to the model
    print("System Message:", system_message)
    print("User Message:", user_message)
    
    
    try:
        compliance_issues_json = json.loads(response.choices[0].message.content)
        rule_exceptions = data.get('rule_exceptions')

        # Logic to handle rule exceptions
        system_message_exceptions = """
        You are an assistant with expertise in pharmaceutical marketing compliance. You are evaluating social media posts for a drug called Slynd. Given a list of non-compliant statements and a list of rule exceptions, determine if any of the non-compliant statements would be compliant when considering the exceptions.
        """

        user_message_template = """
        ### Non-Compliant Statement:
        - `{non_compliant_statement}`

        ### Rule Exceptions:
        - `{rule_exceptions}`

        ### Question:
        - Would this statement be compliant if the rule exceptions are considered? Simply answer YES or NO.
        """

        for issue in compliance_issues_json['results']:
            non_compliant_statement = issue['non_compliant_statement']
            print(f"Checking compliance for statement: {non_compliant_statement}")

            user_message = user_message_template.format(
                non_compliant_statement=non_compliant_statement,
                rule_exceptions=rule_exceptions
            )
            print(f"Generated user message for exception check: {user_message}")

            response_exceptions = client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": system_message_exceptions},
                    {"role": "user", "content": user_message}
                ],
                # response_format={"type": "json_object"},
                temperature=0
            )
            print(f"Received response for exception check: {response_exceptions.choices[0].message.content}")

            if response_exceptions.choices[0].message.content.lower() == 'yes':
                issue['exception'] = 1
                print(f"Statement marked as an exception: {non_compliant_statement}")

        print("Finished checking all statements for exceptions.")
        # Return the updated compliance_issues_json with exceptions handled
        return make_response(jsonify(compliance_issues_json), 200)
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return make_response(jsonify(error=str(e)), 500)

asgi_app = WsgiToAsgi(app)

if __name__ == "__main__":
    app.run()
