import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateQuizQuestions = async (topic: string): Promise<QuizQuestion[]> => {
  const ai = getAiClient();
  if (!ai) return [];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 5 multiple choice questions about "${topic}" for a high school student.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" }
            },
            required: ["question", "options", "correctAnswer"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion[];
    }
    return [];
  } catch (error) {
    console.error("Failed to generate quiz:", error);
    return [];
  }
};

export const getAITutorResponse = async (history: string[], message: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI Service Unavailable";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an encouraging and helpful AI tutor in a Learning Management System. 
      Conversation History: ${JSON.stringify(history)}
      User: ${message}
      
      Keep response concise (under 50 words) and helpful.`,
    });
    return response.text || "I'm sorry, I didn't catch that.";
  } catch (error) {
    console.error("AI Chat error:", error);
    return "I'm having trouble connecting right now.";
  }
};
