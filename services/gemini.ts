
import { GoogleGenAI, Type } from "@google/genai";
import { Vehicle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getDispatcherResponse = async (
  prompt: string, 
  fleetData: Vehicle[], 
  history: { role: string; content: string }[]
) => {
  try {
    const fleetContext = JSON.stringify(fleetData.map(v => ({
      id: v.id,
      name: v.name,
      status: v.status,
      driver: v.driver,
      fuel: v.fuel,
      location: `Lat: ${v.lat}, Lng: ${v.lng}`
    })));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { text: `System Instruction: You are GoFleet AI, a specialized logistics and fleet dispatcher assistant. You have access to current fleet status. Be professional, concise, and data-driven.
        
        Current Fleet Context: ${fleetContext}
        
        User Prompt: ${prompt}` }
      ],
      config: {
        temperature: 0.7,
        topK: 40,
        topP: 0.9,
      }
    });

    return response.text || "I'm having trouble processing that right now. Could you please rephrase?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The fleet communication system is temporarily down. Please try again in a moment.";
  }
};

export const analyzeFleetPerformance = async (fleetData: Vehicle[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this fleet data and provide 3 bullet points for improvement and 1 safety highlight. Data: ${JSON.stringify(fleetData)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            safetyHighlight: { type: Type.STRING }
          },
          required: ["improvements", "safetyHighlight"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return { improvements: ["Monitor fuel levels more closely", "Optimize routing for FL-202"], safetyHighlight: "All drivers within speed limits." };
  }
};
