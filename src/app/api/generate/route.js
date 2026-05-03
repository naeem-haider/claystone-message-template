import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const SAMPLE_TEMPLATES = {
  "Update Message": `Hello there,

I hope you're doing well.

I’m pleased to inform you that I’ve completed the following updates to the project:

- I've successfully saved the JDM Auto Glass theme and applied it to the new Shopify store.

- All the text from the JDM Auto Glass website has been copied and pasted into the new store.

- I've created menu items in the website navbar.

- I've replaced the "JDM Auto Glass" brand name with "CruiserWorx" throughout the site.

- I've made this fully responsive your website for better viewing all device mobile and desktop.

- I've used the 'Land Cruiser car image' throughout the entire website, as you suggested. It now looks even more beautiful and professional.

You can re-view your live store here:
Website URL:

Please take a moment to check everything, and feel free to let me know if you’d like any further adjustments or improvements.

I’ll be happy to assist you.

Note: I have not received any product images or details yet, so I couldn't add any products to your website. Please provide the product details in a CSV format as soon as possible so that the final stage of the project can be completed quickly.

I look forward to your feedback. Thank you.

Best Regards,`,

  "Full Update Message": `Hello there,

I hope you are doing well.

I'm pleased to inform you that I’ve successfully completed the following updates to the project:

I've completed the following tasks for your project:

01. I've designed a fully functional Shopify website.

02. Created the following pages on the website:

- Home
- Services
- Service details page
- About us
- FAQ
- Gallery
- Gallery image details page
- Contact us

05. I've added the necessary apps:

-Live chatting

06. Created the following policy page in the store:

- Privacy Policy 
- Refund Policy
- Terms of Service
- Contact Information

Below is what else I did in this project:

-I've added images and text content on the website.

- I’ve added your logo.

- I've added your contact details.

- I've added Gallery popup.

- All pages are fully optimized for mobile devices, ensuring a smooth and responsive experience.

You can re-view your live website here:
Website URL:

Please explore the site and let me know if you need any further adjustments.

I will be happy to help you and make corrections based on your feedback.

Note: I have completed all the work.Once everything is confirmed, I will proceed to the final stage., please let me know if you require any additional adjustments.

No worries. After delivery, you will also get 30 days of free support.

I look forward to your feedback. Thank you.

Best Regards,`,

  "Delivery Message": `Hello there,

I hope you are doing well.

I'm pleased to inform you that I’ve successfully completed all tasks for the project as per your instructions:

I've completed the following tasks for your project:

01. I've designed a fully functional Shopify website.

02. Created the following pages on the website:

- Home
- Shop
- About Us
- Contact

03. I've added the necessary apps:

- Appstle℠ Bundles & Upsells

- Appstle℠ Subscriptions App

- Appstle℠ Loyalty

- Translate & Adapt

04. Created the following policy page in the store:

- Privacy Policy 
- Shipping Policy
- Refund Policy
- Terms of Service

05. Below is what else I did in this project:

-I've added images and text content on the website.

- I've added your logo.

- I've created one time purchase and monthly Subscription functionality.

- I've created a popup to the store.

- I've created product bundle to the store.

- I've implement Add 1 extra pack and get a MAISON AYANA bottle for free.

- I've implemented multiple packs can add without clicking to the product page.

- I've added "Add quantity selector" (+ / –) directly on product listing (Amazon-style: Add to cart first).

- I've implemented "Up sell and Cross sell" functionality after purchase the product.

- I've implemented rewards funtionality or loyalty to the store.

- I've added all testimonial card text to the store.

- I've improved over all sales logic

- I've added a strong incentive offer.

- All pages are fully optimized for mobile devices, ensuring a smooth and responsive experience.

You can re-view your live website here:
Website URL: 

Please explore the site and let me know if you need any further adjustments.

I will be happy to help you and make corrections based on your feedback.

Note: I wanted to let you know that I've completed all the work as per your requirements. Please accept the delivery. However, the revisions you requested are causing the project timeline delays on my profile, which is negatively impacting my reputation.

Once you confirm that everything is in order, I will proceed to the final stage.

If any changes or fixes are required, you can send the message in the Fiverr inbox, and I will make changes to your website as per all your requirements.

No worries. After delivery, you will also get 30 days of free support.

If there are any further changes needed, please share them through the Fiverr inbox. I will take care of everything promptly.

I hope you understand.

No worries. After delivery, you will also get 30 days of free support. Thank you.

Best Regards,`,
};

const buildPrompt = (data) => {
  const lines = [
    `Client Name: ${data.clientName || "there"}`,
    `Sender Name: ${data.senderName || ""}`,
    `Website URL: ${data.url || "Not provided"}`,
  ];

  if (data.template === "Full Update Message" || data.template === "Delivery Message") {
    lines.push(`Tasks:\n${data.tasks || ""}`);
    lines.push(`Pages Created:\n${data.pages || ""}`);
    lines.push(`Policy Pages:\n${data.policies || ""}`);
    lines.push(`Apps Integrated:\n${data.apps || ""}`);
    lines.push(`Notes:\n${data.notes || ""}`);
  } else if (data.template === "Update Message") {
    lines.push(`Tasks:\n${data.tasks || ""}`);
    lines.push(`Notes:\n${data.notes || ""}`);
  } else {
    lines.push(`Draft Message:\n${data.draft || ""}`);
  }

  const sample = SAMPLE_TEMPLATES[data.template]
    ? `Here is the exact sample style to follow:\n\n${SAMPLE_TEMPLATES[data.template]}\n`
    : "";

  return `You are a professional Shopify developer. The user may write in English, Bangla, or Banglish, but the generated message must be in polished English.

${sample}
Follow the selected template exactly and keep the tone professional, clear, and customer-focused.

Rules:
1. Generate only a valid JSON object with exactly two properties: text and translation.
2. The text field must contain the professional English message.
3. The translation field must contain a natural Bangla translation of the same message.
4. Do not include markdown fences, commentary, or extra text outside the JSON object.
5. Use the provided client name, sender name, and website URL as shown.
6. Always follow the structure and style of the selected template, adapting the content based on the provided tasks, pages, policies, apps, and notes.  
7. Write the message in active voice, using clear and concise language. Avoid passive constructions and ensure the message is engaging and easy to understand.  

Template: ${data.template}
${lines.join("\n")}

Produce the response now.`;
};

const parseJsonResponse = (rawText) => {
  const text = rawText.replace(/```json|```/g, "").trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("Could not locate JSON in model response");
  }

  return JSON.parse(text.slice(start, end + 1));
};

export async function POST(req) {
  try {
    const data = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "API key missing" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = buildPrompt(data);

    const result = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: prompt,
    });

    const rawText = result.text ?? "";
    const parsed = parseJsonResponse(rawText);

    return NextResponse.json({
      text: parsed.text ?? "",
      translation: parsed.translation ?? "",
    });
  } catch (error) {
    console.error("Gemini Route Error:", error);
    return NextResponse.json({ error: "Failed to generate message" }, { status: 500 });
  }
}
