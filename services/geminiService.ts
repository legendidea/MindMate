// FIX: Import `Type` for defining the response schema for JSON mode.
import { GoogleGenAI, Type } from "@google/genai";
import { MoodAnalysis } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// FIX: Refactor to use Gemini's JSON mode for robust parsing, instead of fragile string manipulation. This improves reliability and simplifies the code by removing the need for a separate parsing function.
export async function analyzeMood(userInput: string): Promise<MoodAnalysis> {
  const systemInstruction = `You are MindMate, a highly empathetic and insightful AI companion. Your expertise is in understanding the nuances of human emotion expressed through text. When analyzing a user's message, go beyond surface-level keywords. Pay close attention to subtle cues, underlying tones, mixed feelings, and shifts in energy. Your goal is to provide a deeply perceptive analysis.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Please provide a deep and nuanced mood analysis for the following message: "${userInput}"`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
              type: Type.OBJECT,
              properties: {
                  mood: {
                      type: Type.STRING,
                      description: 'Identify the primary mood, but also consider more nuanced emotions. Use descriptive but clear language. Examples include: Reflective, Hopeful, Frustrated, Content, Fatigued, Anxious, Joyful, Overwhelmed.',
                  },
                  happinessScore: {
                      type: Type.NUMBER,
                      description: 'A number from 1 (very sad) to 10 (very happy) based on the mood',
                  },
                  reason: {
                      type: Type.STRING,
                      description: 'Short reason based on text clues, referencing specific words or phrases if possible.',
                  },
                  message: {
                      type: Type.STRING,
                      description: 'Write a friendly, supportive, and validating reply in a warm human tone',
                  },
                  suggestion: {
                      type: Type.STRING,
                      description: '1 helpful and actionable activity, quote, or piece of advice related to the mood',
                  },
                  moodMatchContent: {
                      type: Type.OBJECT,
                      description: 'Based on the mood, provide one piece of matched content. If the mood is sad, anxious, or stressed, suggest a calming music playlist (type: music). If the mood is happy or joyful, suggest an uplifting activity (type: activity). For neutral or unclear moods, suggest a motivational quote (type: quote).',
                      properties: {
                          type: {
                              type: Type.STRING,
                              enum: ['music', 'quote', 'activity'],
                              description: 'The type of content provided.',
                          },
                          content: {
                              type: Type.STRING,
                              description: 'The content itself. This can be a descriptive title for music (e.g., "Calming Acoustic Playlist"), the text of a quote, or a description of an activity.',
                          },
                          source: {
                              type: Type.STRING,
                              description: 'Optional: The source of the content, e.g., a famous person for a quote.',
                          },
                          query: {
                              type: Type.STRING,
                              description: 'If type is "music", provide a search query suitable for the Spotify API to find a relevant playlist. E.g., "calm acoustic", "upbeat pop hits", "rainy day instrumental". Otherwise, this can be null.'
                          }
                      },
                      required: ['type', 'content'],
                  },
              },
              required: ['mood', 'happinessScore', 'reason', 'message', 'suggestion', 'moodMatchContent'],
          },
      },
    });
    
    const responseText = response.text;
    if (!responseText) {
        throw new Error("Received an empty response from the API.");
    }

    const analysis: MoodAnalysis = JSON.parse(responseText.trim());

    // It's good practice to still validate/sanitize the data from the API.
    analysis.happinessScore = isNaN(analysis.happinessScore) ? 5 : Math.max(1, Math.min(10, analysis.happinessScore));
    
    return analysis;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof SyntaxError) {
      console.error("Failed to parse JSON response from API.", error);
    }
    throw new Error("Failed to get mood analysis from AI.");
  }
}