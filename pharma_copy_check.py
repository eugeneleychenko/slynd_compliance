import streamlit as st
from langchain.prompts import PromptTemplate
from langchain.chat_models import ChatOpenAI
from langchain.chains import LLMChain
from dotenv import load_dotenv
from openai import OpenAI
import json
import base64
import requests
from bs4 import BeautifulSoup


load_dotenv()

caption = ''
post_copy = ''

st.markdown(
    """
    <style>
        .st-emotion-cache-16txtl3 {
            padding-top: 1rem !important;
        }
        
        .eczjsme11 {
            width: 350px;
        }
        
        .st-emotion-cache-1y4p8pa {
            padding-top: 0rem !important;
        }
        .e1nzilvr5 > p{
            font-size: 16px;
        }
        
        
    </style>
    """,
    unsafe_allow_html=True
)

dos = """Include benefits and risks in each post
Disclose serious risks like boxed warnings and contraindications
Link to full risk information
List brand and generic names
Use abbreviations and symbols to save space
Correct misinformation in a truthful, non-misleading way
Identify and limit corrections to specific misinformation
Provide evidence and link to FDA labeling for corrections
Disclose company affiliation in corrections
Disclose company involvement with logo/name
Submit all content to FDA, including third-party site posts
Submit comprehensive websites at first use, then just updates
Submit restricted access sites monthly with screenshots
Only respond publicly to questions specifically naming your drug
In public responses, provide contact info and note off-label topic
Direct users to follow up privately for off-label info
Have medical/scientific personnel provide detailed off-label info privately
Ensure private off-label responses are truthful, non-misleading, accurate and balanced
"""

donts = """Do not post benefits without risks in the same post
Do not bury or downplay risk information
Do not make promotional claims in hyperlinks
Do not omit dosage form and quantitative information
Do not use misleading abbreviations or symbols
Correct misinformation fully and continue monitoring after correcting once
Use a credible source for corrective information
Correct all misinformation about your product, not just negative info
Comply with all labeling and advertising regulations
Do not post independent user generated content not produced or prompted by the company
Submit all social media content at first use or when it changes, except for monthly submissions of restricted access sites
Influence or control over third-party sites requires submission of that content
Do not provide any off-label information publicly
Sales/marketing personnel should not be involved in responding to off-label information requests
Do not link to promotional info or websites in public responses. Only link to FDA-approved labeling
Use scientific, non-promotional tone in public responses
Do not respond publicly to general questions not specifically naming your drug
Do not direct users to promotional URLs for off-label information. Use neutral URLs.
"""

s1 = """Every single post needs the logo or full drug name even if it isn't about Slynd.
"""

s2 = """12/18/2023 - we dont need to explain the UI on the Mockup anymore “The icons around the video are in-app User Interface of Facebook”

12/11/23 - when the claim is first made, need to add “Continue watching for important risk information till the end.”

12/04/23 Full for only videos IRI - link

12/18/23 Multiple-slide carousel post:

IRI Slide 1:
What is SLYND?
SLYND is a birth control pill (oral contraceptive) that is used by females who can become pregnant to prevent pregnancy.

The progestin drospirenone may increase potassium levels in your blood. You should not take SLYND if you have kidney, liver or adrenal disease because this could cause serious heart problems as well as other health problems.

IRI Slide 2:
Do not take SLYND if you:
• have kidney disease or kidney failure. • have reduced adrenal gland function. • have or have had cervical cancer or any cancer that is sensitive to female hormones. • have liver disease, including liver tumors. • have unexplained vaginal bleeding.

Tell your healthcare providers if you have or have had any of these conditions. Your healthcare provider can suggest a different method of birth control.

If any of these conditions happen while you are taking SLYND, stop taking SLYND right away and talk to your healthcare provider. Use non-hormonal contraception when you stop taking SLYND.

IRI Slide 3:
SLYND may cause serious side effects, including: 
• High potassium levels in your blood (hyperkalemia). Certain medicines and conditions can also increase the potassium levels in your blood. Your healthcare provider may check the potassium levels in your blood before and during treatment with SLYND. Call your healthcare provider or go to a hospital emergency room right away if you have signs or symptoms of high potassium levels in your blood including:
• weakness or numbness in an arm or leg. • palpitations (feel like your heart is racing or fluttering) • irregular heartbeat • nausea • vomiting • severe pain in your chest • shortness of breath.

IRI Slide 4:
SLYND may cause serious side effects, including: 
• Blood clot forming in blood vessels. Tell your healthcare provider if you have had a blood clot. Tell your healthcare provider if you plan to have surgery or are not able to be active due to illness or injury. Call your healthcare provider or go to a hospital or emergency room right away if you have:
• leg pain that will not go away. • a sudden, severe headache unlike your usual headaches. • sudden, severe shortness of breath. • sudden change in vision or blindness. • chest pain. • weakness or numbness in your arm or leg. • trouble speaking

IRI Slide 5:
SLYND may cause serious side effects, including: 
• Bone loss. • Cervical Cancer. • Liver problems, including liver tumors. • Ectopic pregnancy (pregnancy in your tubes). This is a medical emergency that often requires surgery. If you have severe abdominal pain, call your healthcare provider or go to a hospital emergency room right away. • Risk of high blood sugar levels in people with diabetes. • Changes in menstrual bleeding. Tell your doctor if you have changes in menstrual bleeding. • Depression, especially if you have had depression in the past.

IRI Slide 6:
What are the most common side effects of SLYND?
• acne • headache • breast pain and tenderness • weight gain • menstrual cramps • nausea • severe vaginal bleeding • less sexual desire

These are not all the possible side effects of SLYND.

This is not all of the important information about SLYND. 

Please visit here to read full Prescribing Information: <slynd.com/pi> before starting SLYND.  
"""

s3 = """Only if a missed pill is mentioned in the post, you must add instruction to every mention of missed pill window.
Example “if you missed a white tablet, take it as soon as you remember and the continue taking a pill each day at the same time”

Severity of symptoms must accompany appropriate recommendations.
Example: "Reach out to your healthcare provider" seems too mild of a recommendation for many of these symptoms - this should probably be a "seek emergency care or reach out to your healthcare provider"

Not all consumers are eligible for a prescription.
Rather than “Get a prescription” say "Get evaluated for a prescription”

Superiority claims.
“It’s about time you consider that upgrade” is a superiority claim - was changed to “it’s about time to consider Slynd”. Superiority claims are only for comparison of the drug makeup itself, not how you can get it or delivery method. For example, saying that you can get it faster or more conveniently is compliant.

Whenever mentioning the 24 hour missed pill window, add info about taking it at the same time everyday.

When claiming “convenient'' add "dosing window" after so it's clear what you are referring to. Slynd is no more convenient than any other birth control and one could argue that implanted devices are more convenient.

Do not imply Slynd is safer than estrogen products without substantial evidence.

Change definitive language about birth control choices to more subjective ones.
Example: Change from referencing that age, bmi, and heart heart are all factors that impact birth control choice to “might be factors you think about when considering birth control”

Change the claims from being about other birth controls to being about Slynd.
Example: Rather than claiming other birth controls have not been proven for effectiveness in high BMI women, the language was changed to “For women with higher BMI, Slynd is effective with no dose adjustment”.

Do not ask a customer to chat with the medical team on a co-pay card advertisement. You are making them an arm of the sales and marketing organization which is discouraged by OIG.

A consumer might mistake "protection" to mean from STDs, need to add clarification.

Footnotes must be beneath the claim.
References must be under IRI.
References are from a Study.
Footnotes are a * / claim (i.e. the missed pill one).


"""
s5 = """It’s about time you consider that upgrade.
> Jenny:”this is a superiority claim. Change this sentence to "It's about time to consider Slynd"
for iri we no longer need iri in text format in the captions because it was shown in the creative
Kind to more kinds of bodies implies we have an additional benefit, PRC does not really approve but we are not changing it.

Jan 5th 2023 - we can't say that spotting/unscheduled bleeding is normal. we have to say common instead.
"""

def scrape_on_brand_pages():
    urls = [
        "https://slynd.com/", 
        "https://slynd.com/faqs/"]
    on_brand_content = ""
    stop_phrase = "We Do Not Sell Your Personal Information"
    for url in urls:
        response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            text = ''
            for string in soup.stripped_strings:
                if stop_phrase in string:
                    break
                text += string + ' '
            on_brand_content += text.strip() + f"\n\n## {url}\n\n"
        else:
            print(f"Failed to retrieve {url}")
    return on_brand_content

on_brand = scrape_on_brand_pages()
# print("Slynd.com scrape: ", on_brand)



st.title("FDA Compliance Checker")
# with st.expander("Upload and Extract Text from Post Image(s)", expanded=True):
#     image_files = st.file_uploader("Drag and drop or click to upload a post image(s)", type=['jpg', 'png', 'jpeg'], accept_multiple_files=True)
#     extract_button = st.button("Extract Text and Images from Posts")
    
#     # Initialize the session state for extracted_texts if it doesn't exist
#     if 'extracted_texts' not in st.session_state:
#         st.session_state['extracted_texts'] = []
    
#     if extract_button and image_files is not None:
#         with st.spinner('Uploading and Extracting Text from Posts...'):
#             for image_file in image_files:
#                 # Convert the uploaded image to base64
#                 base64_image = base64.b64encode(image_file.getvalue()).decode('utf-8')

#                 # Initialize OpenAI client
#                 client = OpenAI()

#                 # Extract words from the image using OpenAI's vision-preview model
#                 response = client.chat.completions.create(
#                     model="gpt-4-vision-preview",
#                     temperature=0,
#                     messages=[
#                         {
#                             "role": "user",
#                             "content": [
#                                 {
#                                     "type": "text",
#                                     "text": "Extract the copy from this post. Just return all the words as you see them. If images or emojis appear, try to explain what they are showing; some might be cute/risky so please don't be too PC. have the response come back in Markdown, where the result would be bolded and all the details would be bulleted and italicized. "
#                                 },
#                                 {
#                                     "type": "image_url",
#                                     "image_url": {
#                                         "url": f"data:image/png;base64,{base64_image}"
#                                     }
#                                 }
#                             ],
#                         }
#                     ],
                    
#                     max_tokens=1500,
#                 )

#                 # Parse the vision response  
#                 response_dict = json.loads(response.json())
#                 extracted_text = response_dict['choices'][0]['message']['content']
#                 st.session_state['extracted_texts'].append(extracted_text)  # Append the extracted text to the session state list

#         for image_file, extracted_text in zip(image_files, st.session_state['extracted_texts']):
#             st.write(f"__Extracted Text for {image_file.name}:__\n{extracted_text}")


@st.cache_data
def get_json_data(url):
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return []

# URL of the JSON data
json_url = "https://opensheet.elk.sh/1txhuues3EN3PSe_MTq57thIfi_afoYFCRZj5G5NhJkk/1"

# Load the JSON data
data = get_json_data(json_url)

# Extract the links for the dropdown
links = [item["Link"] for item in data]

# Create the dropdown
selected_link = st.selectbox("Select a post", links)

# Button to load post content
if st.button("Load Post Content"):
    # Find the selected post data
    post_data = next((item for item in data if item["Link"] == selected_link), None)
    if post_data:
        # Load the values into the variables
        post_copy = post_data["Creative Copy"]
        caption = post_data["Caption"]
        
        # Update the session state
        st.session_state['extracted_texts'] = [post_copy]
        st.session_state['caption'] = caption
        
        # Display the loaded content
        # st.text_area("Post Copy", post_copy, height=300)
        # st.text_input("Caption", caption)
    else:
        st.error("Selected post content could not be loaded.")

# Post Copy and Caption
with st.expander("Post Copy and Caption"):
    post_copy_input = st.text_area("Paste the post copy here", value=st.session_state.get('extracted_texts', [''])[0], height=300)
    caption_input = st.text_input("Enter your caption copy here", value=st.session_state.get('caption', ''))
    
    if post_copy_input:
        # Update the session state with the new post copy
        st.session_state['extracted_texts'] = [post_copy_input]
        
    if caption_input:
        # Update the session state with the new caption
        st.session_state['caption'] = caption_input

dos_input = st.sidebar.text_area("Do's (Extracted from FDA Docs)", value=dos, height=200)
donts_input = st.sidebar.text_area("Don'ts (Extracted from FDA Docs)", value=donts, height=200)
onbrand_input = st.sidebar.text_area("Claims (from Slynd.com/ and Slynd.com/FAQ)", value=on_brand, height=200 )
word_count = len(onbrand_input.split())
st.sidebar.write(f"Word Count: {word_count}")

suzannes_rules_1 = st.sidebar.text_area("Section 1: Branded vs Unbranded", value=s1, height=40)
suzannes_rules_2 = st.sidebar.text_area("Section 2: IRI Rules", value=s2, height=200)
suzannes_rules_3 = st.sidebar.text_area("Section 3: Claims", value=s3, height=200)
suzannes_rules_5 = st.sidebar.text_area("Section 5: Things we cannot says", value=s5, height=200)





def check_compliance(dos_input, donts_input, onbrand_input, suzannes_rules_1, suzannes_rules_2, suzannes_rules_3, suzannes_rules_5, extracted_texts):
    # Create a prompt template
    template = """
    You are an AI compliance checker for pharma marketing via social media posts. A post consists of a Caption and Extracted Text; althought they are seperate, treat them like they are combined. The drug you are monitoring is called Slynd.
    Here are a few things to keep in mind when evaluating post compliance:
    1) Monitor compliance based on Slynd's therapeutic benefits only, not convenience. Example of non therapeutic benefits: Avoiding waiting rooms or not needing to get your blood pressure checked.
    2) Even if the Risk information is available via swipes, it is still compliant. 
    3) Off-label claims are only medicial, indirect benefits of Slynd. An example of an off-label claim might be suggesting that Slynd can improve skin complexion, which is not an approved use or benefit of the drug.
    4) A non off-label claim is the fact that Slynd has no estrogen. 
    5) The IRI can span over several slides. If it is not included, a link to it - 'https://slynd.com/pi' is sufficient.
    6) Posts that reference the topic of missed pills must include a disclaimer about the missed pill protocol. If the post does not mention the missed pill, no need to mention the missed pill protocol.
    7) When the posts says something like 'No blood pressure check needed', they are talking about it from a convenience perspective, and not from a medical perspective at all. Therefore it's compliant.
    8) The compliance checker needs to be only activated when a medical or medical adjacent statement is made. For example, saying something like 'All bodies are beautiful' is not a medicial or medical adjacent statement and therefore doensn't need to be tested for compliance. 
    
    Check the following post copy for compliance against the provided dos, don'ts, on-brand messaging, branded, IRI rules, claims, and things we cannot say.
    Dos and Don'ts come from FDA documents. 
    For on-brand messaging we are focusing on ensureing we are not making any off-label claims; this guidance comes from the Slynd.com site.
    Branded just ensures that each post has appropriate branding.
    IRI rules makes sure that the correct IRI is present in the posts. The full text needs to be present in the post.
    Claims talks about how claims need to be addressed.
    Things we cannot say are list of things that cannot be said, legally.
    \\n\\nCaption: {caption}\\n\\nExtracted Text: {extracted_text}\\n\\nDo's: {dos}\\n\\nDon'ts: {donts}\\n\\nOn Brand: {onbrand}, Branded: {suzannes_rules_1}\\n\\n,IRI Rules: {suzannes_rules_2}\\n\\n,Claims: {suzannes_rules_3}\\n\\n, Things we cannot say: {suzannes_rules_5}\\n\\n
    Only guide yourself with the dos, donts, on-brand messaging, Branded, IRI Rules, Claims, and Things we cannot say. No prior knowledge. 
    Your response should first determine if the text is compliant. Then, substantiate your assessment by citing the caption and extracted text, and cross-referencing with the provided do's, don'ts, on-brand messaging, Branded, IRI Rules, Claims, and Things we cannot say. 
    Make sure to cite from which section (do's, don'ts, on-brand messaging, Branded, IRI Rules, Claims, and Things we cannot say) the post violiates guidelines. 
    Format the response in Markdown, with the compliance result in bold and the supporting details bulleted and italicized. 
    Next to each bullet, have either a ✅  or ❌, to determine if that is positive or negative feedback.
    Remember, combine the caption and extracted text and treat it as one.
    
    Here are two examples of output: 
    (Final Ruling, either this post is or is not compliant)
    (List of reasons to support conclusion)
    
    Do's:
    ❌ (if it's failing)  a) (Reason for failing).
    b) (Rule that it broke)
    c) (Exact words from the Caption or Extracted Text that broke the guidance)
    
    Do's:
    ✅(if it's passing)  a) (Reason for passing).
    b) (Rule that it passed)
    c) (Exact words from the Caption or Extracted Text that passed the guidance)
    """
    
    prompt = PromptTemplate(input_variables=["caption", "extracted_text", "dos", "donts", "onbrand", "suzannes_rules_1", "suzannes_rules_2", "suzannes_rules_3", "suzannes_rules_5"], template=template)
    
    # Create a language model
    llm = ChatOpenAI(temperature=0, model="gpt-4-1106-preview")
    # llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo-16k", openai_api_key=st.secrets["openai_api_key"])
    # llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo-16k-0613")
    
    
    # Create a chain
    chain = LLMChain(llm=llm, prompt=prompt)
    
    filled_template = template.format(
    caption=caption,
    extracted_text="\n\n".join(st.session_state['extracted_texts']),
    dos=dos_input,
    donts=donts_input,
    onbrand=onbrand_input,
    suzannes_rules_1=suzannes_rules_1,
    suzannes_rules_2=suzannes_rules_2,
    suzannes_rules_3=suzannes_rules_3,
    suzannes_rules_5=suzannes_rules_5
)

# Log the filled template to the console
    print("Filled template:", filled_template)
    # Generate a response
    response = chain.predict(caption=caption, extracted_text=st.session_state['extracted_texts'], dos=dos_input, donts=donts_input, onbrand=onbrand_input, suzannes_rules_1=suzannes_rules_1, suzannes_rules_2=suzannes_rules_2, suzannes_rules_3=suzannes_rules_3, suzannes_rules_5=suzannes_rules_5)
    
    # Return the result
    return response

if st.button("Check Compliance"):
    with st.spinner("Checking Compliance..."):
        result = check_compliance(
            dos_input, donts_input, onbrand_input, suzannes_rules_1, 
            suzannes_rules_2, suzannes_rules_3, suzannes_rules_5, 
            st.session_state['extracted_texts']  # Pass the session state variable here
        )
    st.markdown(f"Compliance result: {result}")
    





