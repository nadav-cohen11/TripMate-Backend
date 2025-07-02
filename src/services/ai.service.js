import { InferenceClient } from "@huggingface/inference";
import axios from "axios";

const client = new InferenceClient(process.env.HF_API_KEY);

export const getPlaceSuggestions = async (
  city,
  country,
  travelStyle = 'balanced',
  travelDates,
  groupSize,
  tags = []
) => {
  const days = travelDates ? getDayCount(travelDates.startDate, travelDates.endDate) : 3;
  const tagString = tags.length ? tags.join(', ') : 'general interest';

  const prompt = `
You are an expert travel planner assistant helping a group of ${groupSize || '3-5'} people plan a memorable trip to ${city}, ${country} for ${days} days.

Your mission:
- Design a unique, day-by-day itinerary tailored to a ${travelStyle} experience, focusing on: ${tagString}.
- Each day should feature a distinct theme or highlight (e.g., culture, nature, local cuisine, hidden gems, adventure, relaxation).
- Prioritize authentic local experiences, lesser-known spots, and practical travel tips over typical tourist attractions.
- Include a mix of activities (morning, afternoon, evening) when possible.
- For each day, provide:
  Day X: [Catchy Title for the Day or Main Activity]
  Description: A vivid, engaging summary of what to expect, including why it's special or recommended.
  Link: A clickable Google search or official website for more information.
  Pro Tip: (Optional) A local tip, best time to visit, or insider advice.

Formatting:
- Use clear headings for each day.
- Keep the tone friendly, enthusiastic, and informative.
- Avoid generic recommendations; be creative and specific.

Begin the itinerary below:
`;

  try {
    const chatCompletion = await client.chatCompletion({
      provider: "featherless-ai",
      model: "HuggingFaceH4/zephyr-7b-beta",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const raw = chatCompletion.choices[0].message.content || '';
    const itineraryStart = raw.indexOf('Day 1:');
    const itinerary = itineraryStart !== -1 ? raw.slice(itineraryStart).trim() : 'No itinerary available.';
    return itinerary;
  } catch (error) {
    throw new Error('Failed to fetch itinerary from Hugging Face');
  }
};

function getDayCount(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;
  return diffDays || 3;
}

export const getWeather = async (city, country) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
  const response = await axios.get(url);
  return response.data;
};