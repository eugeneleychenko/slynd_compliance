from flask import Flask, jsonify, make_response, request    
from openai import OpenAI
import os
from dotenv import load_dotenv
import json

app = Flask(__name__)
load_dotenv()
from flask_cors import CORS
# openai.api_key = os.getenv("OPENAI_API_KEY")
app = Flask(__name__)
CORS(app)


client = OpenAI()

@app.route('/compliance_check', methods=['POST'])
def get_1996_yankees_lineup():

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
    You are an assistant with expertise in pharmaceutical marketing compliance. 
    Your task is to evaluate a social media post for the drug Slynd against a set of guidelines to ensure it adheres to FDA regulations, 
    client's branding, and specific drug claims allowed. Follow these steps:
    
    Step 1: Review the Extracted Text from the post and the Caption provided by the user.
    Step 2: Cross-reference the content with the FDA's list of Do's and Don'ts.
    Step 3: Ensure the language aligns with the client's On Brand use cases and phrases.
    Step 4: Verify that the claims made in the post are within the Branded and Allowable Claims from the Slynd handbook.
    Step 5: Lastly, before providing your final feedback, take into account any Rule Exceptions that may apply.
    Step 6: Provide a detailed assessment of the post's compliance.
    Let's think step by step
    
    The assessment output should look like:
    An array of json objects of non-compliant issues. No other words. For each failed compliance issue, including the rules/guidance it broke and from which section. The keys of the json would be: 
    non_compliant_statement, fixes, exceptions. 
    The non_compliant_statement is the statement that broke the stated rules and which rule it specifically broke. The fixes are what can be change for it to be compliant. Exceptions is a binary (0 or 1), if would fix a rule exception.
    Ensure that the JSON output is accurate and strictly adheres to the specified format, without any additional text or comments. You answer MUST contain only JSON even without ```json wrap.
    Present your answer in a JSON format with the following structure:
{
\"results\": [
      {
      \"non_compliant_statement\": \"sample text\",
      \"fixes\": \"sample text.\",
       \"exceptions\": 0,
      }
     // Add more entries as needed
   ]
}
    """
    
    user_message = f"""
    Here is the social media post for Slynd:
    \\n\\nCaption: {caption} \\n\\nExtracted Text: {extracted_text}\\n\\n
    
    FDA's list of do's and don'ts, client's brand use cases and phrases, allowable claims from the Slynd handbook, and rule exceptions are provided as reference.

    Please assess the compliance of this post. \\n\\nc
    
    Do's: {dos}\\n\\nDon'ts: {donts}\\n\\nOn Brand: {onbrand}\\n\\n Branded: {suzannes_rules_1}\\n\\n,Allowable Claims: {suzannes_rules_3}\\n\\n\\n, Rule Exceptions: {rule_exceptions}
    
    Does {suzannes_rules_2} match {iri_input}
    
    """
    
    
    response = client.chat.completions.create(
        # model="gpt-4-turbo-preview",
        model="gpt-3.5-turbo-1106",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": user_message}
        ],
        response_format={ "type": "json_object" }
    )
    try:
        compliance_issues = response.choices[0].message.content
        compliance_issues_json = json.loads(compliance_issues)
        return make_response(jsonify(compliance_issues_json), 200)
    except Exception as e:
        return make_response(jsonify(error=str(e)), 500)

if __name__ == "__main__":
    app.run()
