
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getBirdFact(birdName: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `提供一个关于${birdName}及其在城市迁徙过程中面临的挑战的冷知识，简短有力，控制在50字以内。`,
    });
    return response.text || "保护候鸟，人人有责。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "保持玻璃清洁并张贴防鸟撞贴纸，能挽救无数生命。";
  }
}
