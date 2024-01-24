from flask import Flask, request, jsonify
from langchain.prompts import PromptTemplate
from langchain.chat_models import ChatOpenAI
from langchain.chains import LLMChain
import os
from dotenv import load_dotenv
from flask_cors import CORS
# from typing import List
# from langchain.output_parsers import PydanticOutputParser
# from langchain.pydantic_v1 import BaseModel, Field, validator


load_dotenv

app = Flask(__name__)
CORS(app)

openai_api_key = os.getenv('OPENAI_API_KEY')

@app.route('/compliance_check', methods=['POST'])
def compliance_check():
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

    template = """
        You are an assistant with expertise in pharmaceutical marketing compliance. 
        Your task is to evaluate a social media post for the drug Slynd against a set of guidelines to ensure it adheres to FDA regulations, 
        client's branding, and specific drug claims allowed. Follow these steps:
        
        Step 1: Review the Extracted Text from the post and the caption provided by the user.
        Step 2: Cross-reference the content with the FDA's list of Do's and Don'ts.
        Step 3: Ensure the language aligns with the client's On Brand use cases and phrases.
        Step 4: Verify that the claims made in the post are within the Branded and Allowable Claims from the Slynd handbook.
        Step 4b: Make sure that the IRI
        Step 5: Lastly, before providing your final feedback, take into account any Rule Exceptions that may apply.
        Step 6: Provide a detailed assessment of the post's compliance.
        Let's think step by step
        
        ~~~~
        The assessment output should look like:
        A list of non-compliant issues. No other words. For each failed compliance, including the rules/guidance it broke and from which section. 
        
        Here are a few examples of what the output should look like:
        **The post does not include both benefits and risks in the same post, which is against the FDA guidelines.**
        **The post includes language that implies Slynd is an upgrade or superior in non-drug-related aspects.**
        **The post does not include the logo or full drug name in every single post as required by the branded guidelines.**
        **The post makes convenience claims without specifying "dosing window", which could be misleading.**
        **The post says that spotting/unscheduled bleeding is "normal", which should be replaced with "common".**
       
    
    
        ~~~~~~
        Here is the social media post for Slynd:
        \\n\\nCaption: {caption}\\n\\nExtracted Text: {extracted_text}\\n\\n
        
        FDA's list of do's and don'ts, client's brand use cases and phrases, allowable claims from the Slynd handbook, and rule exceptions are provided as reference.

        Please assess the compliance of this post. \\n\\nc
        
        Do's: {dos}\\n\\nDon'ts: {donts}\\n\\nOn Brand: {onbrand}\\n\\n Branded: {suzannes_rules_1}\\n\\n,Allowable Claims: {suzannes_rules_3}\\n\\n\\n, Rule Exceptions: {rule_exceptions}
        
        Does {suzannes_rules_2} match {iri_input}
        
        
        """
   

    
    prompt = PromptTemplate(input_variables=["caption", "extracted_text", "dos", "donts", "onbrand", "suzannes_rules_1", "suzannes_rules_2", "iri_input", "suzannes_rules_3", "rule_exceptions"], template=template)
    
    # Create a language model
    llm = ChatOpenAI(temperature=0, model="gpt-4-1106-preview", openai_api_key=openai_api_key, model_kwargs={"response_format": "json"})
    # llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo-16k", openai_api_key=openai_api_key)
    
    # Create a chain
    chain = LLMChain(llm=llm, prompt=prompt)
    
    input_data = {
        'caption': caption,
        'extracted_text': extracted_text,
        'dos': dos,
        'donts': donts,
        'onbrand': onbrand,
        'suzannes_rules_1': suzannes_rules_1,
        'suzannes_rules_2': suzannes_rules_2,
        'iri_input': iri_input,
        'suzannes_rules_3': suzannes_rules_3,
        'rule_exceptions': rule_exceptions
        }
    
    # Run the chain and get the result
    result = chain.predict(**input_data)
    
    return jsonify(result)



if __name__ == '__main__':
    app.run(debug=True)

# Only an object of non-compliant statements. No other words. The keys would be id, non_compliant_statements, fixes. Remember keys dont have quotation marks around them. ID is just a number. Non_compliant_statement is the part of the post that failed compliance, including the rules/guidance it broke and from which section. Fixes are how we can fix. Here is an example
#         [
#             {{
#                 id: 1,
#                 non_compliant_statement: 'The post includes promotional claims in hyperlinks, which is against the guidelines.',
#                 fixes: 'Remove any promotional content from hyperlinks to comply with the regulations.'
#             }},
#             {{
#                 id: 2,
#                 non_compliant_statement: 'The dosage form and quantitative information are omitted from the post.',
#                 fixes: 'Include the dosage form and quantitative information as required by the guidelines.'
#             }},
#             {{
#                 id: 3,
#                 non_compliant_statement: 'Misleading abbreviations are used in the post.',
#                 fixes: 'Replace abbreviations with their full terms to avoid potential misunderstandings.'
#             }}  
            
#         ]