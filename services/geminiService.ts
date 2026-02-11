
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeLetter = async (content: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Ringkaslah isi surat berikut ini menjadi satu kalimat yang padat dan informatif dalam Bahasa Indonesia: \n\n ${content}`,
    });
    return response.text?.trim() || "Gagal membuat ringkasan.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Terjadi kesalahan saat menghubungi AI.";
  }
};

export const extractMetadata = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Ekstrak informasi penting dari teks surat berikut dalam format JSON. Field yang dibutuhkan: 
      - number (nomor surat)
      - sender (pengirim)
      - receiver (penerima)
      - title (perihal/judul singkat)
      - category (pilih satu: Dinas, Pribadi, Undangan, Pemberitahuan, Rahasia, Niaga, Lainnya)
      
      Teks surat: \n ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            number: { type: Type.STRING },
            sender: { type: Type.STRING },
            receiver: { type: Type.STRING },
            title: { type: Type.STRING },
            category: { type: Type.STRING },
          },
          required: ["number", "sender", "receiver", "title", "category"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Extraction Error:", error);
    return null;
  }
};
