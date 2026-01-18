
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getGameStrategy = async (gameType: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide 3 quick winning strategies for ${gameType} tournaments in a JSON format. Include a title and a short description for each.`,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

export const getSupportResponse = async (question: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a helpful customer support agent for 'GameArena Pro', a gaming tournament platform. Answer this user query: "${question}"`,
    });
    return response.text;
  } catch (error) {
    return "I'm having trouble connecting to support. Please try again later.";
  }
};
