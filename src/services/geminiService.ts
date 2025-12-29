import { GoogleGenAI } from "@google/genai";
import { Coordinates, RecommendationResponse, GroundingChunk, FilterState, SortOption } from "../types";

const apiKey = process.env.API_KEY || '';

export const getPlaceRecommendations = async (
  mood: string,
  location: Coordinates,
  filters: FilterState,
  sortBy: SortOption
): Promise<RecommendationResponse> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Using gemini-2.5-flash as it supports googleMaps tool
  const modelId = "gemini-2.5-flash";
  
  // Build dynamic prompt parts based on filters
  let filterInstructions = "";
  if (filters.openNow) {
    filterInstructions += "- Strictly find places that are currently OPEN.\n";
  }
  if (filters.topRated) {
    filterInstructions += "- Strictly find places with a rating of 4.5 or higher.\n";
  }
  if (filters.priceLevel !== 'any') {
    if (filters.priceLevel === 'budget') filterInstructions += "- Look for budget-friendly / cheap options (Price level $).\n";
    if (filters.priceLevel === 'moderate') filterInstructions += "- Look for moderately priced options (Price level $$).\n";
    if (filters.priceLevel === 'expensive') filterInstructions += "- Look for expensive / high-end options (Price level $$$ or $$$$).\n";
  }

  // Build sorting instructions
  let sortInstructions = "Sort the suggestions by relevance to the mood.";
  if (sortBy === 'rating') {
    sortInstructions = "Sort the suggestions strictly by highest rating first.";
  } else if (sortBy === 'distance') {
    sortInstructions = "Sort the suggestions strictly by closest distance to my location first.";
  }

  const prompt = `
    I am currently at latitude: ${location.latitude}, longitude: ${location.longitude}.
    My current mood/intent is: "${mood}".
    
    Please find 4-6 specific places near me that perfectly match this mood.
    
    APPLY THESE FILTERS STRIGENTLY:
    ${filterInstructions}
    
    SORTING ORDER:
    ${sortInstructions}

    For each place, provide a brief, engaging reason why it fits the mood, mention its rating if available, and its general vibe.
    
    Crucial: ensure you use the Google Maps tool to ground your response so I get real locations.
    Structure the text response to be a helpful summary of the options.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
          },
        },
      },
    });

    const text = response.text || "No specific details found.";
    
    // Extract grounding chunks which contain the structured map data
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Filter strictly for map chunks
    const mapChunks = chunks.filter((chunk: any) => chunk.maps && chunk.maps.title);

    return {
      text,
      places: mapChunks as GroundingChunk[],
    };
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
};