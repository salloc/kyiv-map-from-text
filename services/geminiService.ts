import { GoogleGenAI, Type } from '@google/genai';
import type { LocationData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const responseSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            locationName: {
                type: Type.STRING,
                description: "Назва місця, знайденого в тексті (вулиця, район, метро, орієнтир).",
            },
            latitude: {
                type: Type.NUMBER,
                description: "Приблизна широта для цього місця в Києві.",
            },
            longitude: {
                type: Type.NUMBER,
                description: "Приблизна довгота для цього місця в Києві.",
            },
            type: {
                type: Type.STRING,
                description: "Тип події: 'activity' (для активних дій, наприклад, 'роздають', 'зупиняють') або 'warning' (для попереджень, наприклад, 'будьте обережні', 'перевірки').",
            },
            time: {
                type: Type.STRING,
                description: "Час, згаданий у тексті, якщо є. Інакше null.",
            },
            originalText: {
                type: Type.STRING,
                description: "Фрагмент оригінального тексту, що стосується цього місця.",
            },
        },
        required: ["locationName", "latitude", "longitude", "type", "originalText"],
    },
};

const systemInstruction = `Ти — ШІ-помічник для картографічного застосунку "Київ Карта Патрулів". Твоє завдання — аналізувати україномовні текстові повідомлення про події в Києві. Витягуй з тексту всі згадані локації (вулиці, райони, станції метро, пам'ятки), час події (якщо є) та класифікуй тип події як 'activity' або 'warning' на основі контексту. Повертай дані у структурованому форматі JSON. Локації мають стосуватися виключно міста Київ, Україна. Надай приблизні, але реалістичні географічні координати (широту та довготу) для кожної локації. Якщо локація нечітка (наприклад, "Борщагівка"), вкажи координати центральної частини цього району.`;

export const analyzeTextForLocations = async (text: string): Promise<LocationData[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: text,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
            },
        });
        
        const jsonString = response.text.trim();
        if (!jsonString) {
            return [];
        }
        const locations = JSON.parse(jsonString) as LocationData[];
        return locations;
    } catch (error) {
        console.error("Error analyzing text with Gemini:", error);
        throw new Error("Не вдалося проаналізувати текст. Можливо, некоректний формат відповіді від AI.");
    }
};