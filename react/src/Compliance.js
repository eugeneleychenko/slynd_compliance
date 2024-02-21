import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputLabel,
  FormControl,
  FormControlLabel,
  CircularProgress,
  Checkbox,
  Divider,
  Slider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const ComplianceChecker = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPost, setSelectedPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState("");
  const [creativeCopy, setCreativeCopy] = useState("");
  const [iri, setIRI] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState([]);
  const [certaintyThreshold, setCertaintyThreshold] = useState(70);
  const [complianceResult, setComplianceResult] = useState({});
  const [compliancePercentage, setCompliancePercentage] = useState(0);
  const [showComplianceResults, setShowComplianceResults] = useState(false);
  const [fdaDoChanged, setFdaDoChanged] = useState(false);
  const [fdaDontChanged, setFdaDontChanged] = useState(false);
  const [onBrandClaimsChanged, setOnBrandClaimsChanged] = useState(false);
  const [section1Changed, setSection1Changed] = useState(false);
  const [section2Changed, setSection2Changed] = useState(false);
  const [section3Changed, setSection3Changed] = useState(false);
  const [ruleExceptionsChanged, setRuleExceptionsChanged] = useState(false);
  const [containsIRI, setContainsIRI] = useState(false);
  const [containsLogoAndGenericName, setContainsLogoAndGenericName] =
    useState(false);

  useEffect(() => {
    setCompliancePercentage(checked.length / complianceResult.results?.length);
  }, [checked]);

  // const handleCheckComplianceClick = () => {
  //   setIsLoading(true);
  //   setShowComplianceResults(false); // Initially hide the results

  //   setTimeout(() => {
  //     setIsLoading(false);
  //     setShowComplianceResults(true); // Show the results after 5 seconds
  //   }, 5000);
  // };

  const handleDrawerToggle = () => {
    setSidebarOpen((prevSidebarOpen) => !prevSidebarOpen);
  };

  const handleToggle = (nonCompliantStatement) => () => {
    console.log("Toggling statement:", nonCompliantStatement);
    console.log("Current checked state before toggle:", checked);
    const currentIndex = checked.indexOf(nonCompliantStatement);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(nonCompliantStatement);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    console.log("New checked state after toggle:", newChecked);
  };

  useEffect(() => {
    fetch(
      "https://opensheet.elk.sh/1txhuues3EN3PSe_MTq57thIfi_afoYFCRZj5G5NhJkk/1"
    )
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      });
  }, []);

  const applyExceptions = () => {
    const idsToCheck = complianceResult.results
      .filter((result) => result.exception === 1)
      .map((result) => result.non_compliant_statement);
    // Add idsToCheck to the existing checked array without overwriting
    const newChecked = [...new Set([...checked, ...idsToCheck])];
    setChecked(newChecked);
  };

  const handlePostSelectionChange = (event) => {
    setSelectedPost(event.target.value);
    const selectedPostData = posts.find(
      (post) => post.Link === event.target.value
    );
    if (selectedPostData) {
      setCaption(selectedPostData.Caption);
      setCreativeCopy(selectedPostData["Creative Copy"]);
      setIRI(selectedPostData.IRI);
    }
  };

  const loadPostContent = () => {
    const selectedPostData = posts.find((post) => post.Link === selectedPost);
    if (selectedPostData) {
      setCreativeCopy(selectedPostData["Creative Copy"]);
      setCaption(selectedPostData.Caption);
      setIRI(selectedPostData.IRI);
    }
  };

  const checkCompliance = async () => {
    setIsLoading(true);
    setComplianceResult([]); // Reset previous results

    const data = {
      caption: caption,
      creativeCopy: creativeCopy,
      FDA_Do: FDA_Do,
      FDA_dont: FDA_dont,
      on_brand_claims: on_brand_claims,
      s1: s1,
      s2: s2,
      s3: s3,
      iri: iri,
      rule_exceptions: rule_exceptions,
    };

    try {
      const response = await fetch(
        "https://slynd-server.onrender.com/compliance_check",
        // "http://127.0.0.1:5000",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("result", result);

      setComplianceResult(result);
    } catch (error) {
      console.error("There was an error!", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (complianceResult && complianceResult.results) {
      console.log("complianceResult updated", complianceResult);
      // Perform any additional actions needed when complianceResult updates
    }
  }, [complianceResult]); // Add complianceResult as a dependency to this effect

  // Add handlers to set the changed state to true when the TextField content changes
  const handleFdaDoChange = (event) => {
    setFDA_DoState(event.target.value);
    setFdaDoChanged(true);
  };

  const handleFdaDontChange = (event) => {
    setFDA_DontState(event.target.value);
    setFdaDontChanged(true);
  };

  const handleOnBrandClaimsChange = (event) => {
    setOnBrandClaimsState(event.target.value);
    setOnBrandClaimsChanged(true);
  };

  const handleSection1Change = (event) => {
    setSection1State(event.target.value);
    setSection1Changed(true);
  };

  const handleSection2Change = (event) => {
    setSection2State(event.target.value);
    setSection2Changed(true);
  };

  const handleSection3Change = (event) => {
    setSection3State(event.target.value);
    setSection3Changed(true);
  };

  const handleRuleExceptionsChange = (event) => {
    setRuleExceptionsState(event.target.value);
    setRuleExceptionsChanged(true);
  };

  const handleCertaintyThresholdChange = (event, newValue) => {
    setCertaintyThreshold(newValue);
  };

  const handleContainsIRIChange = (event) => {
    setContainsIRI(event.target.checked);
    const ruleToAdd = "Link to full risk information is included";

    if (event.target.checked) {
      setCreativeCopy((prevState) =>
        prevState.includes(ruleToAdd)
          ? prevState
          : prevState + "\n\n" + ruleToAdd
      );
    } else {
      setCreativeCopy((prevState) => prevState.replace("\n\n" + ruleToAdd, ""));
    }
  };

  const handleContainsLogoAndGenericNameChange = (event) => {
    setContainsLogoAndGenericName(event.target.checked);
    const ruleToAdd =
      "Contains the Slynd logo, generic name, and dosage form and quantitative info.";

    if (event.target.checked) {
      setCreativeCopy((prevState) =>
        prevState.includes(ruleToAdd)
          ? prevState
          : prevState + "\n\n" + ruleToAdd
      );
    } else {
      setCreativeCopy((prevState) => prevState.replace("\n\n" + ruleToAdd, ""));
    }
  };

  // Add a generic save function (you'll need to implement the actual save logic)
  const saveChanges = (field) => {
    // Implement save logic here
    console.log(`Saving changes for ${field}`);
    // Reset the changed state to false after saving
    switch (field) {
      case "FDA_Do":
        setFdaDoChanged(false);
        break;
      case "FDA_Dont":
        setFdaDontChanged(false);
        break;
      case "OnBrandClaims":
        setOnBrandClaimsChanged(false);
        break;
      case "Section1":
        setSection1Changed(false);
        break;
      case "Section2":
        setSection2Changed(false);
        break;
      case "Section3":
        setSection3Changed(false);
        break;
      case "RuleExceptions":
        setRuleExceptionsChanged(false);
        break;
      default:
        break;
    }
  };

  const FDA_Do = `Include benefits and risks in each post
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
  `;

  const FDA_dont = `Do not post medical benefits without risks in the same post
  Do not bury or downplay risk information

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
  
  
  Do not direct users to promotional URLs for off-label information. Use neutral URLs.
  `;

  const on_brand_claims = `LET’S LOVE EVERY BODY
  Slynd is a birth control that is for many kinds of bodies. Start my Slynd journey
  Ready for a Slynd prescription? Have questions? Talk to a nurse
  Slynd patient savings program
  We believe birth control should fit more women like you
  Many women are limited in their choice for oral contraceptives. If you’re looking to avoid unnecessary hormones, have a high BMI, and have been told to avoid estrogen products, Slynd® may be right for you!
  Estrogen-free Slynd is an oral contraceptive that does not contain any estrogen, and only has the hormone drospirenone, which is a progestin. This makes it suitable for some women who wish to or need to avoid estrogen.
  Manageable Bleeding
  Slynd clinical studies have shown that the rate of unscheduled bleeding declined over time when taking it regularly. Your bleeding is likely to be more manageable as your body adjusts after the first few months.
  a, b
  a In clinical studies, 3.5% of patients dropped out due to bleeding irregularities.
  b Based on subject diaries from 4 clinical trials of Slynd, 64% of females experienced unscheduled bleeding at Cycle 1. This percentage decrease to 40% by cycle 13.
  Flexible to your lifestyle and needs
  Sometimes life can get in the way and you may forget to take your pill. Slynd has a flexible 24-hour missed pill window c to accommodate a busy life! It is important to try and take your pill at the same time every day.
  c If you miss a pill, take it as soon as you remember and then continue taking a pill each day at the same time.
  The Slynd® Difference
  Birth control should be designed to fit more body types and health situations. That’s why our estrogen-free formula has a 24-hour missed pill window and doesn’t contain any unnecessary hormones. d Learn more about Slynd®, what makes our pill different, and how we put our years of expertise into an oral contraceptive that may work for you.
  d If you miss a pill, take it as soon as you remember and then continue taking a pill each day at the same time.
  Start my Slynd journey
  Slynd® Patient Savings Program
  Use our savings card to reduce the cost of your Slynd® birth control prescription! Get the savings card
  Eligible patients may pay as little as $25* per 1-month or 3-month prescription fill.
  *Savings may vary depending on insurance coverage. Maximum savings limits apply, 
  patient out-of-pocket expense will vary depending on insurance coverage. Offer not valid for patients enrolled in Medicare, 
  Medicaid, or other federal or state healthcare programs. 
  Please see below for Program Terms, Conditions, and Eligibility Criteria.
  We want you to feel empowered by your decision
  The first step to taking charge of your health is learning more about what options you have available to you. 
  Our experts have compiled a number of resources to fuel your curiosity and support your understanding of birth control.
  Learn more about contraception options and how they each affect your body
  Learn how your menstrual cycle and reproductive system work, as well as the various prescription and nonprescription birth control choices you have.
  Learn more about paying less for Slynd
  We believe everyone deserves access to birth control. That’s why we’ve created a savings program where you may pay as little as $25* per one month or 3 month prescription for Slynd®.
  *Savings may vary depending on insurance coverage. Maximum savings limits apply, 
  patient out-of-pocket expense will vary depending on insurance coverage. Offer not valid for patients enrolled in 
  Medicare, Medicaid, or other federal or state healthcare programs. Please see below for Program Terms, 
  Conditions, and Eligibility Criteria.
  Learn More about Slynd Dosing
  Slynd® is the only estrogen-free oral contraceptive with a 24-hour missed 
  pill window e and a manageable bleeding profile f . Find out why this estrogen-free pill may be right for you.
  e If you miss a pill, take it as soon as you remember and then continue taking a pill each day at the same time.
  f In clinical studies, 3.5% of patients dropped out due to bleeding irregularities.
  FAQ
  We know you’ve got questions—that’s why we’ve prepared answers. Check out the most common questions we get from our patients.
  Is Slynd right for you? Let’s find out.
  Ready for a Slynd prescription? Questions? Chat live with a nurse right now
  Questions to ask your doctor
  Is Slynd right for me?
  Slynd® is a trademark of Chemo Research, S.L.
  Slynd® is a trademark of Chemo Research, S.L.
  ~~~~~
  FAQs
  We’re prepared with all the answers you need. Whether you’ve never taken birth control before, have experience with estrogen-free birth control, or are more familiar with pills that do contain estrogen, we’re guessing you probably have some questions. Take a look at the FAQs our experts have gathered below, or head to our Resources section for even more information.
  What is Slynd®?
  + Slynd ® is a birth control pill (oral contraceptive) also called a POP (progestin only pill) that is used by females who can become pregnant to prevent pregnancy.
  How does Slynd® work for contraception?
  + Slynd ® is effective at preventing pregnancy. Your chance of getting pregnant depends on how well you follow the directions for taking your birth control pills. The better you follow the directions, the less chance you have of getting pregnant. Based on the results of one clinical study of a 28-day regimen of Slynd ® about 4 out of 100 females may get pregnant within the first year they use Slynd ® .
  Who should not take Slynd®?
  + You should not take Slynd ® if you have kidney disease or kidney failure, reduced adrenal gland function (adrenal insufficiency), have or have had cervical cancer or any cancer that is sensitive to female hormones, liver disease, including liver tumors or unexplained vaginal bleeding. Tell your healthcare provider if you have or have had any of these conditions. Your health care provider can suggest a different method of birth control.
  How should I take Slynd®?
  + Slynd ® (white active and green inactive tablets) is swallowed whole once a day. Take one tablet daily for 28 consecutive days; one white active tablet daily during the first 24 days and one green inactive tablet daily during the 4 following days. Tablets must be taken every day at about the same time of the day so that the interval between two tablets is always 24 hours.
  When can I start taking Slynd®?
  + If you start taking Slynd ® and you are not currently using a hormonal birth control method: Start Slynd ® on the first day (Day 1) of your natural menstrual period (Day 1 Start). Your healthcare provider should tell you when to start taking your birth control pill. If you start taking Slynd ® and you are switching from another birth control pill: Start your new Slynd ® blister pack on the same day that you would start the next pack of your previous birth control method. Do not continue taking the pills from your previous birth control pack. If you start taking Slynd ® and you are switching from a vaginal ring or transdermal patch: Start taking Slynd ® on the day you would have inserted the next ring or applied the next patch. If you start taking Slynd ® and you are switching from a progestin only method such as an implant or injection: Start taking Slynd ® on the day of removal of your implant or on the day when you would have had your next injection. If you start taking Slynd ® and you are switching from an intrauterine device or system (IUD or IUS): Start taking Slynd ® on the day of removal of your IUD or IUS.
  What if I want to become pregnant?
  + You may stop taking Slynd ® whenever you wish. Consider a visit with your healthcare provider for a pre-pregnancy checkup before you stop taking Slynd ® .
  What are possible serious side effects of Slynd®?
  + SLYND may cause serious side effects, including:
  High potassium levels in your blood (hyperkalemia). Certain medicines and conditions can also increase the potassium levels in your blood. Your healthcare provider may check the potassium levels in your blood before and during treatment with SLYND. Call your healthcare provider or go to a hospital emergency room right away if you have signs or symptoms of high potassium levels in your blood including: weakness or numbness in an arm or leg. palpitations (feel like your heart is racing or fluttering) or irregular heartbeat. nausea. vomiting. severe pain in your chest. shortness of breath.
  Blood clot forming in blood vessels. Tell your healthcare provider if you have had a blood clot. Tell your healthcare provider if you plan to have surgery or are not able to be active due to illness or injury. Call your healthcare provider or go to a hospital or emergency room right away if you have: leg pain that will not go away. a sudden, severe headache unlike your usual headaches. sudden, severe shortness of breath. sudden change in vision or blindness. chest pain. weakness or numbness in your arm or leg. trouble speaking.
  Bone loss. Cervical Cancer. Liver problems, including liver tumors. Ectopic pregnancy (pregnancy in your tubes). This is a medical emergency that often requires surgery. If you have severe abdominal pain, call your healthcare provider or go to a hospital emergency room right away.
  Risk of high blood sugar levels in people with diabetes. Changes in menstrual bleeding. Tell your doctor if you have changes in menstrual bleeding.
  Depression, especially if you have had depression in the past.
  What are the most common side effects of Slynd®?
  + The most common side effects of Slynd ® include acne, headache, breast pain and tenderness, weight gain, menstrual cramps, nausea, severe vaginal bleeding and less sexual desire. Call your doctor for medical advice about side effects. You may report side effects to FDA at 1-800-FDA-1088.
  What should I know about my period when taking Slynd®?
  + As with some other oral contraceptives, when you take Slynd ® , you may have bleeding and spotting between periods, called unscheduled bleeding. This is common and may occur during the first few months of use. With continued use, you may not experience periods at all while taking Slynd ® . If you experience changes in menstrual bleeding, call your healthcare provider. It is important to continue your pills on a regular schedule to prevent a pregnancy.
  What if I don’t have my scheduled period while taking Slynd®?
  + Slynd may cause changes in bleeding patterns, especially during the first three months of use. These bleeding irregularities may resolve over time. If bleeding persists or occurs after previously regular cycles, contact your healthcare provider. If you miss a period and have not taken Slynd according to directions, or miss 2 periods in a row, or feel like you may be pregnant, call your healthcare provider. If you have a positive pregnancy test, you should stop taking Slynd.
  What should I do if I miss any Slynd® pills?
  + If one white active tablet is missed, take the missed tablet as soon as possible. Continue taking one tablet a day until the pack is finished. If two or more white active tablets are missed, take the last missed tablet as soon as possible. Continue one tablet a day until the pack is finished (one or more missed tablet(s) will remain in the blister pack). Use a non-hormonal back-up birth control method (like a condom or spermicide) if you have sex during the first 7 days after missing your pills. You do not need to take 1 or more missed green pills. Take the green pill at your next regular time, every day until you finish the pack (this means 1 or more missed green pills will remain the blister pack).
  Is Slynd right for you? Let’s find out.
  Ready for a Slynd prescription? Questions? Chat live with a nurse right now
  Questions to ask your doctor
  Is Slynd right for me?
  Slynd® is a trademark of Chemo Research, S.L.
  Slynd® is a trademark of Chemo Research, S.L.
  ©2024 Exeltis USA, Inc. (formerly Everett Laboratories) All rights reserved.
  EXS-23-341 R02 Terms and conditions
  
  `;

  const s1 =
    "Every single post needs the logo or full drug name even if it isn't about Slynd.";

  const s2 = `What is SLYND?
  SLYND is a birth control pill (oral contraceptive) that is used by females who can become pregnant to prevent pregnancy.
  
  The progestin drospirenone may increase potassium levels in your blood. You should not take SLYND if you have kidney, liver or adrenal disease because this could cause serious heart problems as well as other health problems.
  
  
  Do not take SLYND if you:
  • have kidney disease or kidney failure. • have reduced adrenal gland function. • have or have had cervical cancer or any cancer that is sensitive to female hormones. • have liver disease, including liver tumors. • have unexplained vaginal bleeding.
  
  Tell your healthcare providers if you have or have had any of these conditions. Your healthcare provider can suggest a different method of birth control.
  
  If any of these conditions happen while you are taking SLYND, stop taking SLYND right away and talk to your healthcare provider. Use non-hormonal contraception when you stop taking SLYND.
  
  
  SLYND may cause serious side effects, including: 
  • High potassium levels in your blood (hyperkalemia). Certain medicines and conditions can also increase the potassium levels in your blood. Your healthcare provider may check the potassium levels in your blood before and during treatment with SLYND. Call your healthcare provider or go to a hospital emergency room right away if you have signs or symptoms of high potassium levels in your blood including:
  • weakness or numbness in an arm or leg. • palpitations (feel like your heart is racing or fluttering) • irregular heartbeat • nausea • vomiting • severe pain in your chest • shortness of breath.
  
  
  SLYND may cause serious side effects, including: 
  • Blood clot forming in blood vessels. Tell your healthcare provider if you have had a blood clot. Tell your healthcare provider if you plan to have surgery or are not able to be active due to illness or injury. Call your healthcare provider or go to a hospital or emergency room right away if you have:
  • leg pain that will not go away. • a sudden, severe headache unlike your usual headaches. • sudden, severe shortness of breath. • sudden change in vision or blindness. • chest pain. • weakness or numbness in your arm or leg. • trouble speaking
  
  
  SLYND may cause serious side effects, including: 
  • Bone loss. • Cervical Cancer. • Liver problems, including liver tumors. • Ectopic pregnancy (pregnancy in your tubes). This is a medical emergency that often requires surgery. If you have severe abdominal pain, call your healthcare provider or go to a hospital emergency room right away. • Risk of high blood sugar levels in people with diabetes. • Changes in menstrual bleeding. Tell your doctor if you have changes in menstrual bleeding. • Depression, especially if you have had depression in the past.
  
  
  What are the most common side effects of SLYND?
  • acne • headache • breast pain and tenderness • weight gain • menstrual cramps • nausea • severe vaginal bleeding • less sexual desire
  
  These are not all the possible side effects of SLYND.
  
  This is not all of the important information about SLYND. 
  
  Please visit here to read full Prescribing Information: <slynd.com/pi> before starting SLYND.  
  `;

  const s3 = `1. **Missed Pill Instructions:** Only if a post references a missed white tablet, include specific instructions.
  - Example: 'If you missed a white tablet, take it as soon as you remember and then continue taking a pill each day at the same time.'

2. **Severity of Symptoms:** When mentioning severe symptoms, provide urgent recommendations.
  - Example: For severe symptoms, advise 'seek emergency care or reach out to your healthcare provider' instead of just 'reach out to your healthcare provider.'

3. **Eligibility for Prescription:** Avoid assuming all consumers can get a prescription.
  - Example: Replace 'Get a prescription' with 'Get evaluated for a prescription.'

4. **Superiority Claims:** Only make superiority claims about the drug's accessibility or delivery method, not composition.
  - Example: Instead of 'Its about time you consider that upgrade,' use 'Its about time to consider Slynd.'

5. **24-Hour Missed Pill Window:** Always pair mentions of the 24-hour missed pill window with the importance of taking the pill at the same time every day.

6. **Convenience Claims:** When claiming "convenient," specify "dosing window" to clarify the context.
  - Example: 'Slynd offers a convenient dosing window.'

7. **Safety Claims:** Do not claim Slynd is safer than estrogen products without substantial evidence.

8. **Subjective Language:** Use subjective language when discussing birth control choices.
  - Example: Change 'Age, BMI, and heart rate are factors that impact birth control choice' to 'Age, BMI, and heart rate might be factors you consider when choosing birth control.'

9. Shift claims from being about other birth controls to being specifically about Slynd.
  - Example: Instead of 'Other birth controls have not been proven effective for high BMI women,' say 'For women with higher BMI, Slynd is effective with no dose adjustment.'

10. **Medical Team Interaction:** Do not invite customers to chat with the medical team in co-pay card advertisements to avoid making them appear as part of the sales and marketing team.

11. **Clarification on Protection:** When using the term "protection," clarify that it does not refer to protection from STDs.

12. **Footnotes and References:** Place footnotes directly beneath the claim and references under the IRI. Footnotes should be marked with an asterisk (*) and accompany the relevant claim.
   - Example: 'Slynd has a 24-hour missed pill window*.'
   - *Footnote: 'If you miss a white tablet, take it as soon as you remember and then continue taking a pill each day at the same time.'

13. **Avoiding Superiority Language:** Do not use language that implies Slynd is an upgrade or superior in non-drug-related aspects.
   - Example: Change 'It's about time you consider that upgrade' to 'It's about time to consider Slynd.'

14. **IRI in Captions:** IRI information is no longer required in text format in the captions if it is shown in the creative.

15. **Inclusive Language:** The phrase 'kind to more kinds of bodies' is used, although not strongly endorsed by PRC, and will not be changed.

16. Only if normal bleedings is mention, Do not say that spotting/unscheduled bleeding is 'normal'; instead, refer to it as 'common.'
   - Example: 'Spotting or unscheduled bleeding is a common side effect.'
`;

  const rule_exceptions = `1. You are allowed to talk about the convenience/speed/comfort of obtaining the drug in question; whether it's not needing to spend time at the pharmacy or not needing to take blood pressure tests. This is not considered a benefit and therefore doesn't need to have a referencing risk.
  2. Talking about how Slynd doesn't contain estrogen is not a superiority claim.
  3. Linking back to the website is allowed.
  4. Slynd being Estrogen is not a superiority claim. 
  5. Link to full risk info is not a benefit
  6. Social media posts are not public responses.
  7. Tips are not off-label information or superiority claims. 
  8. Any questions in the posts are rhetorical
  `;

  const [FDA_DoState, setFDA_DoState] = useState(FDA_Do); // Set default value to existing FDA_Do variable

  // Define state and setter for FDA Dont's
  const [FDA_DontState, setFDA_DontState] = useState(FDA_dont); // Set default value to existing FDA_dont variable

  // Define state and setter for On Brand Claims
  const [OnBrandClaimsState, setOnBrandClaimsState] = useState(on_brand_claims); // Set default value to existing on_brand_claims variable

  // Define state and setter for Section 1
  const [Section1State, setSection1State] = useState(s1); // Set default value to existing s1 variable

  // Define state and setter for Section 2
  const [Section2State, setSection2State] = useState(s2); // Set default value to existing s2 variable

  // Define state and setter for Section 3
  const [Section3State, setSection3State] = useState(s3); // Set default value to existing s3 variable

  // Define state and setter for Rule Exceptions
  const [RuleExceptionsState, setRuleExceptionsState] =
    useState(rule_exceptions); // Set default value to existing rule_exceptions variable
  return (
    <Box sx={{ display: "flex", transition: "width 0.5s" }}>
      <Drawer
        variant="persistent"
        className="css-1n3eiey-MuiDrawer-docked"
        anchor="left"
        open={sidebarOpen}
        sx={{
          width: sidebarOpen ? "30%" : "0%",
          flexShrink: 0,
          transition: "width 0.5s",
          "& .MuiDrawer-paper": {
            width: sidebarOpen ? "30%" : "0%",
            boxSizing: "border-box",
            padding: sidebarOpen ? " 0 20px" : "0",
            transition: "width 0.5s, padding 0.5s",
          },
        }}
      >
        <Typography variant="h5" style={{ margin: "20px 0" }}>
          Rules
        </Typography>
        <Divider />
        <br />
        <Typography id="certainty-threshold-slider" gutterBottom>
          <em>Certainty Threshold</em>
        </Typography>
        <Slider
          aria-labelledby="certainty-threshold-slider"
          value={certaintyThreshold}
          onChange={handleCertaintyThresholdChange}
          valueLabelDisplay="auto"
          step={1}
          min={0}
          max={100}
          valueLabelFormat={(value) => `${value}%`}
        />
        <TextField
          label="FDA Do's"
          variant="outlined"
          fullWidth
          margin="normal"
          placeholder="Enter FDA Do's"
          multiline
          rows={4}
          defaultValue={FDA_Do}
          onChange={handleFdaDoChange}
        />
        {fdaDoChanged && (
          <Button
            variant="contained"
            onClick={() => saveChanges("FDA_Do")}
            sx={{ width: "30%", ml: "auto", display: "block" }}
          >
            Save
          </Button>
        )}

        <TextField
          label="FDA Dont's"
          variant="outlined"
          fullWidth
          margin="normal"
          placeholder="Enter FDA Dont's"
          multiline
          rows={4}
          defaultValue={FDA_dont}
          onChange={handleFdaDontChange}
        />
        {fdaDontChanged && (
          <Button
            variant="contained"
            onClick={() => saveChanges("FDA_Dont")}
            sx={{ width: "30%", ml: "auto", display: "block" }}
          >
            Save
          </Button>
        )}
        <TextField
          label="On Brand Claims"
          variant="outlined"
          fullWidth
          margin="normal"
          placeholder="Enter On Brand Claims"
          multiline
          rows={4}
          defaultValue={on_brand_claims}
          onChange={handleOnBrandClaimsChange}
        />
        {onBrandClaimsChanged && (
          <Button
            variant="contained"
            onClick={() => saveChanges("OnBrandClaims")}
            sx={{ width: "30%", ml: "auto", display: "block" }}
          >
            Save
          </Button>
        )}
        <TextField
          label="Section 1 - Branded vs Unbranded "
          variant="outlined"
          fullWidth
          margin="normal"
          placeholder="Enter Section 1"
          multiline
          rows={4}
          defaultValue={s1}
          onChange={handleSection1Change}
        />
        {section1Changed && (
          <Button
            variant="contained"
            onClick={() => saveChanges("Section1")}
            sx={{ width: "30%", ml: "auto", display: "block" }}
          >
            Save
          </Button>
        )}
        <TextField
          label="Section 2 - IRI Rules"
          variant="outlined"
          fullWidth
          margin="normal"
          placeholder="Enter Section 2"
          multiline
          rows={4}
          defaultValue={s2}
          onChange={handleSection2Change}
        />
        {section2Changed && (
          <Button
            variant="contained"
            onClick={() => saveChanges("Section2")}
            sx={{ width: "30%", ml: "auto", display: "block" }}
          >
            Save
          </Button>
        )}
        <TextField
          label="Section 3 - Allowable Claims"
          variant="outlined"
          fullWidth
          margin="normal"
          placeholder="Enter Section 3"
          multiline
          rows={4}
          defaultValue={s3}
          onChange={handleSection3Change}
        />
        {section3Changed && (
          <Button
            variant="contained"
            onClick={() => saveChanges("Section3")}
            sx={{ width: "30%", ml: "auto", display: "block" }}
          >
            Save
          </Button>
        )}
        <TextField
          label="Rule Exceptions"
          variant="outlined"
          fullWidth
          margin="normal"
          placeholder="Enter Rule Exceptions"
          multiline
          rows={4}
          value={RuleExceptionsState}
          onChange={handleRuleExceptionsChange}
        />
        {ruleExceptionsChanged && (
          <Button
            variant="contained"
            onClick={() => saveChanges("RuleExceptions")}
            sx={{ width: "30%", ml: "auto", display: "block" }}
          >
            Save
          </Button>
        )}
        <br />
        <Button
          variant="contained"
          style={{ marginBottom: "20px" }}
          onClick={applyExceptions}
          disabled={
            !complianceResult.results || complianceResult.results.length === 0
          }
        >
          Apply Exceptions
        </Button>
      </Drawer>
      <Box sx={{ position: "absolute", left: sidebarOpen ? "30%" : 0, top: 0 }}>
        <Button onClick={handleDrawerToggle}>
          {sidebarOpen ? <KeyboardArrowLeftIcon /> : <KeyboardArrowRightIcon />}
        </Button>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: sidebarOpen ? "50%" : "100%", // Adjust the width based on the sidebar state
          transition: "width 0.3s ease-in-out", // Define the transition directly
        }}
      >
        <Typography variant="h2">Slynd FDA Compliance Checker</Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel id="post-select-label">Select a Post</InputLabel>
          <Select
            labelId="post-select-label"
            id="post-select"
            value={selectedPost}
            label="Select a Post"
            onChange={handlePostSelectionChange}
          >
            {posts.map((post, index) => (
              <MenuItem key={index} value={post.Link}>
                {post["Link"]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Accordion elevation={6} style={{ mb: "10px" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" component="h2">
              <strong>Post Copy, Caption and IRI</strong>
            </Typography>
          </AccordionSummary>
          <FormControlLabel
            control={
              <Checkbox
                checked={containsIRI}
                onChange={handleContainsIRIChange}
              />
            }
            label="Contains IRI"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={containsLogoAndGenericName}
                onChange={handleContainsLogoAndGenericNameChange}
              />
            }
            label="Contains Slynd logo, Generic Name and Dosage"
          />
          <AccordionDetails>
            <TextField
              label="Paste the copy here"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              value={creativeCopy}
              onChange={(e) => setCreativeCopy(e.target.value)}
              maxRows={15}
            />
            <TextField
              label="Enter your caption here"
              variant="outlined"
              fullWidth
              margin="normal"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <TextField
              label="IRI copy here"
              variant="outlined"
              fullWidth
              margin="normal"
              value={iri}
              onChange={(e) => setIRI(e.target.value)}
              multiline
              maxRows={4}
            />
          </AccordionDetails>
        </Accordion>
        <br />
        <Button
          variant="contained"
          // onClick={handleCheckComplianceClick}
          onClick={checkCompliance}
          style={{ m: "10px" }}
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? <CircularProgress size={24} /> : "Check Compliance"}
        </Button>
        <br />
        {complianceResult.results && (
          <>
            <Typography
              variant="h5"
              component="h5"
              style={{ paddingTop: "30px" }}
            >
              How compliant is the post?
            </Typography>
            <Box sx={{ width: "100%", mb: 2 }}>
              <Box display="flex" alignItems="center">
                <Box width="100%" mr={1}>
                  <LinearProgress
                    variant="determinate"
                    value={compliancePercentage * 100}
                  />
                </Box>
                <Box minWidth={35}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                  >{`${Math.round(compliancePercentage * 100)}%`}</Typography>
                </Box>
              </Box>
            </Box>
            <Box>
              {complianceResult.results.map((result, index) => {
                const isStatementChecked =
                  checked.includes(result.non_compliant_statement) ||
                  result.certainty < certaintyThreshold;

                return (
                  <div
                    key={index}
                    style={{ marginBottom: "10px", textAlign: "left" }}
                  >
                    <Divider />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isStatementChecked}
                          onChange={handleToggle(
                            result.non_compliant_statement
                          )}
                        />
                      }
                      label={
                        <div>
                          <br />
                          <span
                            style={{
                              textDecoration: isStatementChecked
                                ? "line-through"
                                : "none",
                            }}
                          >
                            <strong>Post Copy:</strong>{" "}
                            {result.non_compliant_statement}
                          </span>

                          <div
                            style={{
                              marginTop: "5px",
                              textDecoration: isStatementChecked
                                ? "line-through"
                                : "none",
                            }}
                          >
                            <strong>Rule Broken:</strong> {result.rule_broken}
                          </div>
                          <div
                            style={{
                              marginTop: "5px",
                              textDecoration: isStatementChecked
                                ? "line-through"
                                : "none",
                            }}
                          >
                            <strong>Section:</strong> {result.section}
                          </div>
                          <div
                            style={{
                              marginTop: "5px",
                              textDecoration: isStatementChecked
                                ? "line-through"
                                : "none",
                            }}
                          >
                            <strong>Certainty:</strong> {result.certainty}%
                          </div>
                          <div
                            style={{
                              marginTop: "5px",
                              textDecoration: isStatementChecked
                                ? "line-through"
                                : "none",
                            }}
                          >
                            <strong>Certainty Reasoning:</strong>{" "}
                            {result.certainty_reason}
                          </div>
                          <div
                            style={{
                              marginTop: "5px",
                              textDecoration: isStatementChecked
                                ? "line-through"
                                : "none",
                            }}
                          >
                            <strong>Rewrite:</strong> {result.rewrite}
                          </div>
                        </div>
                      }
                    />
                  </div>
                );
              })}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ComplianceChecker;
