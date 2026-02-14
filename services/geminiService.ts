
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialInsights = async (context: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `به عنوان یک دستیار هوش مصنوعی ERP، بر اساس این داده‌ها ۳ تحلیل کوتاه و کاربردی ارائه بده: ${context}. پاسخ‌ها باید مسلکی، مختصر و به زبان دری (افغانستان) باشند.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "در حال حاضر قادر به تولید تحلیل نیستم.";
  }
};

export interface ChatResponse {
  text: string;
  sources?: { title: string; uri: string }[];
}

export const startERPConsultation = async (history: { role: 'user' | 'model', parts: { text: string }[] }[], message: string): Promise<ChatResponse> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: history,
      config: {
        systemInstruction: "شما نکسوس AI هستید، مشاور ارشد سیستم‌های ERP. شما به کاربران در درک داده‌های تجاری، استراتژی‌های گودام و اصول محاسبه کمک می‌کنید. پاسخ‌های شما باید به زبان دری و با لحنی حرفه‌ای باشد. اگر از اطلاعات خارجی استفاده می‌کنید، منبع آن را ذکر کنید.",
        tools: [{ googleSearch: {} }]
      }
    });
    
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.filter(chunk => chunk.web)
      .map(chunk => ({
        title: chunk.web.title,
        uri: chunk.web.uri
      }));

    return {
      text: response.text || "متاسفم، نتوانستم درخواست شما را پردازش کنم.",
      sources: sources
    };
  } catch (error) {
    console.error("Chat Error:", error);
    return { text: "در پردازش درخواست شما خطایی رخ داد. لطفاً دوباره تلاش کنید." };
  }
};

export const processCommand = async (command: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `تحلیل دستور کاربر: "${command}". 
      ماژول‌های موجود: DASHBOARD, USERS, CUSTOMERS, PRODUCTS, SALES, PURCHASES, JOURNAL, WAREHOUSE, CURRENCY, BRANCHES, EXPENSES, ASSETS.
      یک شی JSON با دو فیلد برگردانید: 
      1. 'targetModule': نام ماژولی که بیشترین شباهت را دارد.
      2. 'intent': شرح کوتاهی از آنچه کاربر می‌خواهد.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetModule: { type: Type.STRING },
            intent: { type: Type.STRING }
          },
          required: ["targetModule", "intent"],
        }
      }
    });
    const jsonStr = response.text?.trim() || "{}";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Command Error:", error);
    return null;
  }
};
