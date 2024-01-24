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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
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
  const samplecomplianceResult = [
    {
      id: 1,
      non_compliant_statement:
        "You can get Slynd (drospirenone) online! Why? Because no estrogen = no blood pressure check! This line fails to comply with the FDA's Do's and Don'ts as it posts benefits without risks in the same post (Do not post benefits without risks in the same post).",
      fixes:
        "Ensure that both benefits and risks are included in the same post to comply with FDA regulations.",
      checked: 1,
    },
    {
      id: 2,
      non_compliant_statement:
        "Because Slynd doesn’t contain estrogen, there is no need for a blood pressure check!' - This line also fails to comply with the FDA's Do's and Don'ts as it implies a benefit without accompanying risk information (Do not post benefits without risks in the same post).",
      fixes:
        "Include serious risks, boxed warnings, and contraindications in the post as per FDA requirements.",
      checked: 1,
    },
    // {
    //   id: 3,
    //   non_compliant_statement:
    //     "The entire post lacks any risk information, which is a requirement (Include benefits and risks in each post)",
    //   fixes:
    //     "Add a link to the full risk information to comply with FDA regulations.",
    //   checked: 0,
    // },

    {
      id: 5,
      non_compliant_statement:
        "The post does not disclose serious risks like boxed warnings and contraindications (Disclose serious risks like boxed warnings and contraindications).",
      fixes:
        'Remove or replace the phrase "kind to more kinds of bodies" with an approved on-brand message.',
      checked: 1,
    },
    {
      id: 6,
      non_compliant_statement:
        "The post does not seem to follow the On Brand use cases and phrases, as it does not include any of the key phrases or messaging from the brand guidelines provided.",
      fixes:
        "Ensure that the logo or full drug name is included in every post.",
      checked: 1,
    },
    {
      id: 7,
      non_compliant_statement:
        "The post does not verify that the claims made are within the Branded and Allowable Claims from the Slynd handbook. It does not mention any of the important risk information or the most common side effects of Slynd.",
      fixes: 'Clarify convenience claims by specifying "dosing window".',
      checked: 0,
    },
  ];

  const [complianceResult, setComplianceResult] = useState([]);
  const [compliancePercentage, setCompliancePercentage] = useState(0);
  const [showComplianceResults, setShowComplianceResults] = useState(false);

  useEffect(() => {
    setCompliancePercentage(checked.length / samplecomplianceResult.length);
  }, [checked]);

  const handleCheckComplianceClick = () => {
    setIsLoading(true);
    setShowComplianceResults(false); // Initially hide the results

    setTimeout(() => {
      setIsLoading(false);
      setShowComplianceResults(true); // Show the results after 5 seconds
    }, 5000);
  };

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value.id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value.id);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    // setCompliancePercentage(calculateCompliancePercentage());
  };

  const calculateCompliancePercentage = () => {
    return checked.length / samplecomplianceResult.length;
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
    const idsToCheck = samplecomplianceResult
      .filter((result) => result.checked === 1)
      .map((result) => result.id);
    setChecked(idsToCheck);
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
      const response = await fetch("http://127.0.0.1:5000/compliance_check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.text();
      console.log("result", result);

      // Split the result into lines and filter out empty lines
      const issues = result.split("\n").filter((line) => line.trim() !== "");
      console.log("issues", issues);
      // Map the issues to an array of objects with an id and non_compliant_statement

      setComplianceResult(issues);
    } catch (error) {
      console.error("There was an error!", error);
    } finally {
      setIsLoading(false);
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

  const FDA_dont = `Do not post benefits without risks in the same post
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

4. **Superiority Claims:** Only make superiority claims about the drug's composition, not its accessibility or delivery method.
  - Example: Instead of 'Its about time you consider that upgrade,' use 'Its about time to consider Slynd.'

5. **24-Hour Missed Pill Window:** Always pair mentions of the 24-hour missed pill window with the importance of taking the pill at the same time every day.

6. **Convenience Claims:** When claiming "convenient," specify "dosing window" to clarify the context.
  - Example: 'Slynd offers a convenient dosing window.'

7. **Safety Claims:** Do not claim Slynd is safer than estrogen products without substantial evidence.

8. **Subjective Language:** Use subjective language when discussing birth control choices.
  - Example: Change 'Age, BMI, and heart rate are factors that impact birth control choice' to 'Age, BMI, and heart rate might be factors you consider when choosing birth control.'

9. **Focus on Slynd:** Shift claims from being about other birth controls to being specifically about Slynd.
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

16. **Describing Side Effects:** Do not say that spotting/unscheduled bleeding is 'normal'; instead, refer to it as 'common.'
   - Example: 'Spotting or unscheduled bleeding is a common side effect.'
`;

  const rule_exceptions = `1. You are allowed to talk about the convenience of obtaining Slynd; wheter it's not needing to spend time at the pharmacy or not needing to take blood pressure tests. This is not considered a benefit and therefore doesn't need to have a referencing risk.`;

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="persistent"
        className="css-1n3eiey-MuiDrawer-docked"
        anchor="left"
        open={sidebarOpen}
        sx={{
          width: "30%",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: "30%",
            boxSizing: "border-box",
            padding: " 0 20px",
          },
        }}
        style={{ padding: " 0 20px" }}
      >
        <Typography variant="h5" style={{ margin: "20px 0" }}>
          Rules
        </Typography>
        <TextField
          label="FDA Do's"
          variant="outlined"
          fullWidth
          margin="normal"
          placeholder="Enter FDA Do's"
          multiline
          rows={4}
          defaultValue={FDA_Do}
        />
        <TextField
          label="FDA Dont's"
          variant="outlined"
          fullWidth
          margin="normal"
          placeholder="Enter FDA Dont's"
          multiline
          rows={4}
          defaultValue={FDA_dont}
        />
        <TextField
          label="On Brand Claims"
          variant="outlined"
          fullWidth
          margin="normal"
          placeholder="Enter On Brand Claims"
          multiline
          rows={4}
          defaultValue={on_brand_claims}
        />
        <TextField
          label="Section 1 - Branded vs Unbranded "
          variant="outlined"
          fullWidth
          margin="normal"
          placeholder="Enter Section 1"
          multiline
          rows={4}
          defaultValue={s1}
        />
        <TextField
          label="Section 2 - IRI Rules"
          variant="outlined"
          fullWidth
          margin="normal"
          placeholder="Enter Section 2"
          multiline
          rows={4}
          defaultValue={s2}
        />
        <TextField
          label="Section 3 - Allowable Claims"
          variant="outlined"
          fullWidth
          margin="normal"
          placeholder="Enter Section 3"
          multiline
          rows={4}
          defaultValue={s3}
        />
        <TextField
          label="Rule Exceptions"
          variant="outlined"
          fullWidth
          margin="normal"
          placeholder="Enter Rule Exceptions"
          multiline
          rows={4}
          defaultValue={rule_exceptions}
        />
        <Button style={{ marginBottom: "20px" }} onClick={applyExceptions}>
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
          flexGrow: sidebarOpen ? 1 : 1,
          p: 3,
          width: sidebarOpen ? "70%" : "100%",
          transition: "width 0.3s",
          //   position: "absolute", // Use absolute positioning
          //   left: sidebarOpen ? "30%" : 0, // Adjust left based on sidebar state
          //   top: 0,
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

        <Accordion stlye={{ mb: "10px" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" component="h2">
              <strong>Post Copy, Caption and IRI</strong>
            </Typography>
          </AccordionSummary>
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
          onClick={handleCheckComplianceClick}
          style={{ m: "10px" }}
          disabled={isLoading} // Disable button when loading
        >
          {isLoading ? <CircularProgress size={24} /> : "Check Compliance"}
        </Button>
        <br />
        {showComplianceResults && (
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
              {samplecomplianceResult?.map((issue, index) => (
                <div key={issue.id} style={{ marginBottom: "10px" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked.includes(issue.id)}
                        onChange={handleToggle(issue)}
                      />
                    }
                    label={
                      <span
                        style={{
                          textDecoration: checked.includes(issue.id)
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {issue.non_compliant_statement}
                      </span>
                    }
                  />
                </div>
              ))}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ComplianceChecker;