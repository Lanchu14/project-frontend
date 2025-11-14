import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyBia3LRIK3ihDywoMhFesJjHC198ggtwhA");

// This function sends user prompts to Gemini and returns the AI response
export async function askGemini(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, something went wrong while contacting Gemini.";
  }
}
