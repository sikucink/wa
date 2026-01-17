import { geminiClient } from "../clients/gemini.client.js";
import config from "../config/config.js";

export async function askGemini(prompt) {
  try {
    const finalPrompt = `${prompt}`;

    const body = {
      contents: [
        {
          parts: [
            {
              text: finalPrompt,
            },
          ],
        },
      ],
    };

    const response = await geminiClient.post(`/models/${config.gemini.model}:generateContent`, body);
    return response.data?.candidates?.[0]?.content?.parts?.[0].text ?? "No response";
  } catch (error) {
    throw new Error("Failed to get response from Gemini API");
  }
}
