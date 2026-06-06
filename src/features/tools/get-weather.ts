import { tool } from 'ai';
import { z } from 'zod';

export const weatherTool = tool({
  description: 'Get the weather in a location',
  inputSchema: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  execute: async ({ location }) => {
    const response = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${location}`
  );
  return response.json();
  },
});
