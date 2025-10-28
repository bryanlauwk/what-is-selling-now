import { GoogleGenAI } from "@google/genai";
import { ProductTrend, TrendData, GroundingChunk } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const fetchTrendingProducts = async (country: string, category: string, timeRange: string): Promise<TrendData> => {
  
  const categoryInstruction = category === 'All Categories'
    ? 'across all consumer product categories'
    : `in the '${category}' category`;

  const prompt = `
    Task: Find the top 10-15 trending consumer products based on Google Trends data and provide a market insight.
    
    Context:
    - Country: ${country}
    - Time Range: ${timeRange}
    - Category: ${categoryInstruction}
    - Primary Data Source for Ranking: Your primary analysis for ranking and trend data MUST be based on Google Trends search patterns.
    - Secondary Data Source for Insight: For the 'insight' field, you can synthesize information from broader market research sources (like Statista, etc.) if needed.

    Output Requirements:
    - Format: Your entire response MUST be a single, valid JSON object. Do not add any text, explanations, or markdown formatting like \`\`\`json before or after the object.
    - Top-Level Object Structure: The root JSON object must have two keys: "products" (an array of objects) and "insight" (a string).
    - Product Object Structure: Each object in the "products" array must have these exact keys:
      "rank": number,
      "productName": string,
      "growth": number,
      "trend": string,
      "trendData": number[],
      "examples": string[],
      "suppliers": string[]
    
    Field Instructions:
    - ALL fields are mandatory. Do not leave any fields null or empty.
    - suppliers: List 2-3 popular online retailers where the products are sold.
    - trendData: Provide an array of 12 numbers representing search interest over the time period.
    - insight: Provide a single, concise sentence summarizing the key market trend observed from the results.
    
    Example for the entire JSON output:
    {
      "products": [
        {
          "rank": 1,
          "productName": "Portable Projector",
          "growth": 35,
          "trend": "Fast Rising",
          "trendData": [20, 25, 30, 40, 50, 60, 70, 80, 85, 90, 95, 100],
          "examples": ["Anker Nebula Capsule", "Samsung Freestyle"],
          "suppliers": ["Amazon", "BestBuy", "Lazada"]
        }
      ],
      "insight": "The demand for portable and home entertainment electronics is currently surging in ${country}."
    }

    Generate the JSON object now.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    const text = response.text;
    
    if (!text) {
        throw new Error("The model returned an empty response. This may be due to content safety filters.");
    }
    
    let jsonString = "";
    const markdownMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (markdownMatch && markdownMatch[1]) {
      jsonString = markdownMatch[1].trim();
    } else {
      const objectMatch = text.match(/(\{[\s\S]*\})/);
      if (objectMatch && objectMatch[0]) {
        jsonString = objectMatch[0].trim();
      }
    }

    if (!jsonString) {
      console.error("No JSON object found in response:", text);
      throw new Error("The response did not contain a valid JSON object.");
    }
    
    let data;
    try {
        data = JSON.parse(jsonString) as { products: ProductTrend[], insight: string };
    } catch (parseError) {
        console.error("Failed to parse JSON string:", jsonString);
        throw new Error("The model returned a malformed JSON response.");
    }


    if (!data || !Array.isArray(data.products) || typeof data.insight !== 'string') {
        throw new Error("Parsed data is not in the expected format.");
    }
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];

    return { products: data.products, sources: sources as GroundingChunk[], insight: data.insight };
    
  } catch (error) {
    console.error("Error fetching or parsing trending products:", error);
    throw new Error("Failed to get a valid response from the model.");
  }
};