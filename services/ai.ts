import { GoogleGenAI } from "@google/genai";
import { Review } from '../types';

export const aiService = {
  summarizeReviews: async (reviews: Review[]): Promise<string> => {
    // Basic validation for the prompt input
    if (reviews.length === 0) {
      return "No reviews available to summarize.";
    }

    const comments = reviews
      .filter(r => r.comment && r.comment.trim().length > 0)
      .map(r => `- ${r.comment} (Rating: ${r.deliveryRating.overall}/5)`)
      .join('\n');

    if (!comments) {
      return "No text comments available to summarize.";
    }

    try {
      // Initialize GoogleGenAI with the API key from environment variables as per guidelines.
      // We assume process.env.API_KEY is pre-configured and valid.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are an analytics assistant for a pharmacy delivery service. 
        Analyze the following customer feedback comments and provide a concise summary of themes. 
        Focus on delivery speed, product quality, and customer service.
        
        Feedback:
        ${comments}`,
      });

      // Directly access the .text property of the response as per the SDK guidelines.
      return response.text || "Could not generate summary.";
    } catch (error) {
      console.error("AI Service Error:", error);
      return "Error generating summary. Please check system configuration.";
    }
  }
};