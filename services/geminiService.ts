

import { GoogleGenAI } from "@google/genai";
import { ProductTrend, TrendData, GroundingChunk, StrategicInsights } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const fetchTrendingProducts = async (country: string, category: string, timeRange: string, listSize: number, businessDescription: string): Promise<TrendData> => {
  
  const categoryInstruction = category === 'All Categories'
    ? 'across all consumer product categories'
    : `in the '${category}' category`;
  
  const numProducts = listSize;
  const isPersonalized = businessDescription.trim().length > 0;

  const genericPrompt = `
    Task: Generate a list of exactly ${numProducts} high-level trending consumer products based on increasing search interest.

    Context:
    - Country: ${country}
    - Time Range: ${timeRange}
    - Category: ${categoryInstruction}
    - High-Level Rule: Your primary goal is to generate a list of the requested size. Rank the products from most to least trending based on their Trend Score. If you cannot find enough products with a strong upward trend to fill the list, include products with lower or stable trend scores to meet the requested count of ${numProducts}. Data integrity is still crucial: all data, keywords, and product ideas must be strictly relevant to ${country} and not generalized from other regions.
    - Methodology: Your analysis MUST be based on Google Trends data. First, identify a generic product category that is trending. Then, for each product, calculate a Trend Score. Finally, find specific, underlying search terms (e.g., brand/model names) that show significant search growth and are responsible for the high-level trend.

    Output Requirements:
    - Format: Your entire response MUST be a single, valid JSON object. Do not add any text, explanations, or markdown formatting like \`\`\`json before or after the object.
    - Top-Level Object Structure: The root JSON object must have one key: "products" (an array of exactly ${numProducts} product objects).
    - Product Object Structure: Each object in the "products" array must have these exact keys:
      "rank": number,
      "productName": string,
      "trendScore": number,
      "breakoutKeywords": { "keyword": string, "growth": number }[],
      "suppliers": string[],
      "relatedProducts": string[]
    
    Field Instructions:
    - ALL fields are mandatory. Do not leave any fields null, empty, or incomplete.
    - productName: The high-level, generic product name.
    - trendScore: CRITICAL - This field is absolutely mandatory. Provide a score from 1 to 100 indicating the strength of the product's upward trend. The score MUST be based on Google Trends data over the specified Time Range. It should reflect the trend's velocity (how fast it's growing), recency (is the growth happening now?), and duration. A score of 100 represents an extremely strong, accelerating trend.
    - breakoutKeywords: An array of 3-5 objects. Each object represents a specific, real search term that is trending. Provide its name ('keyword') and its estimated search 'growth' percentage. These keywords are the evidence for the trend.
    - suppliers: List 2-3 popular online retailers where the products are sold.
    - relatedProducts: List 2-3 complementary or related products.
    
    Example for the entire JSON output:
    {
      "products": [
        {
          "rank": 1,
          "productName": "Portable Projector",
          "trendScore": 92,
          "breakoutKeywords": [
            { "keyword": "Samsung Freestyle Gen 2", "growth": 75 },
            { "keyword": "Anker Nebula Capsule 3", "growth": 60 },
            { "keyword": "XGIMI MoGo 2 Pro", "growth": 55 }
          ],
          "suppliers": ["Amazon", "Lazada", "Shopee"],
          "relatedProducts": ["Projector Screen", "Portable Power Station", "Bluetooth Speaker"]
        }
      ]
    }

    Generate the JSON object now.
  `;

  const personalizedPrompt = `
    Task: Generate a personalized market analysis for a business, including trending products, strategic insights, opportunity gaps, and a go-to-market plan.

    Business Context:
    - User's Business: "${businessDescription}"
    - Target Country: ${country}
    - Time Range for Trends: ${timeRange}
    - Product Category Focus: ${categoryInstruction}
    - List Size for Trends: ${numProducts}

    Methodology:
    - Your analysis MUST be based on Google Trends data for the specified country and time range.
    - First, understand the user's business.
    - Second, perform the trend analysis as requested in the original task, but find trends that are RELEVANT to the user's business.
    - Third, based on the intersection of the user's business and the local trends, generate the strategic insights.

    Output Requirements:
    - Format: Your entire response MUST be a single, valid JSON object. Do not add any text, explanations, or markdown formatting like \`\`\`json.
    - Top-Level Object Structure: The root JSON object must have TWO keys: "products" (an array) and "insights" (an object).
    - "products" Array: An array of exactly ${numProducts} product objects, following the original schema (rank, productName, trendScore, breakoutKeywords, suppliers, relatedProducts). These products should be relevant to the user's business.
    - "insights" Object: This object must have these exact keys:
      - "marketInsight": A string (2-3 sentences) summarizing how the user's product category is perceived in the target country, mentioning local tastes or competitors.
      - "opportunityGaps": An array of 2-4 strings. Each string should describe a specific, actionable opportunity or unmet need in the market.
      - "go_to_market_strategy": An array of 2-4 strings. Each string should be a concrete, tactical step for a go-to-market plan (e.g., "Partner with local food bloggers on Instagram," "Focus on 'sustainability' as a key marketing message").

    Example for the entire JSON output:
    {
      "products": [
        {
          "rank": 1,
          "productName": "Cold Brew Coffee Maker",
          "trendScore": 88,
          "breakoutKeywords": [{"keyword": "Hario cold brew pot", "growth": 60}],
          "suppliers": ["Lazada", "Shopee"],
          "relatedProducts": ["Coffee Grinder", "Artisan Coffee Beans"]
        }
      ],
      "insights": {
        "marketInsight": "The coffee market in Singapore is mature and values quality and convenience. There's a growing 'cafe-at-home' culture, with consumers willing to invest in premium equipment.",
        "opportunityGaps": [
          "High demand for ready-to-drink cold brew concentrate, but limited local craft options.",
          "Growing interest in sustainable and ethically sourced coffee beans, a niche your brand can fill."
        ],
        "go_to_market_strategy": [
          "Launch a subscription box for single-origin beans, catering to coffee connoisseurs.",
          "Use TikTok and Instagram to showcase brewing guides and recipes using your products.",
          "Collaborate with local lifestyle influencers who focus on home and wellness."
        ]
      }
    }

    Generate the JSON object now.
  `;

  const prompt = isPersonalized ? personalizedPrompt : genericPrompt;

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
        data = JSON.parse(jsonString);
    } catch (parseError) {
        console.error("Failed to parse JSON string:", jsonString);
        throw new Error("The model returned a malformed JSON response.");
    }
    
    if (isPersonalized) {
      if (!data || !Array.isArray(data.products) || !data.insights) {
          throw new Error("Parsed data is not in the expected personalized format.");
      }
    } else {
      if (!data || !Array.isArray(data.products)) {
          throw new Error("Parsed data is not in the expected generic format.");
      }
    }

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];

    const products = data.products as ProductTrend[];
    const insights = isPersonalized ? data.insights as StrategicInsights : undefined;
  
    return { products, sources: sources as GroundingChunk[], insights };
    
  } catch (error) {
    console.error("Error fetching or parsing trending products:", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("Failed to get a valid response from the model.");
  }
};