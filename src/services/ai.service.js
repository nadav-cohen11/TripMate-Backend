import axios from 'axios';

const HF_API_KEY = process.env.HF_API_KEY;
const HF_API_URL = 'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta';

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
You are a professional travel planner assistant.

Your task is to create a day-by-day travel itinerary for a group of ${groupSize || '3-5'} people visiting ${city}, ${country} for ${days} days. 

The group is interested in a ${travelStyle} experience, with preferences for: ${tagString}.

Please output the itinerary in the following format:

Day X: [Title of Place or Activity]  
Description: A short, vivid description of the activity/place.  
Link: A clickable Google search or official site URL for more information.

Ensure each day is unique and balanced (e.g. a mix of culture, nature, local spots, food, etc). Prefer hidden gems and local insights over tourist traps when possible.  
The tone should be friendly and informative.

Begin now.
`;

  try {
    const { data } = await axios.post(
      HF_API_URL,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 800,
          temperature: 0.8,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const raw = data?.[0]?.generated_text || '';
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