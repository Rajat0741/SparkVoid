import { tool } from 'ai';
import { z } from 'zod';
import * as Sentry from "@sentry/nextjs";

export const weatherTool = tool({
  description: 'Get current weather conditions for a specific location. Only use this when the user explicitly asks about weather or climate conditions for a place.',
  inputSchema: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  execute: async ({ location }) => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${location}`
      );

      if (!response.ok) {
        Sentry.metrics.count('tool_execution_error', 1, {
          attributes: {
            tool: 'get-weather',
            error_type: 'http_error',
            status_code: response.status,
          },
        });
        throw new Error(`Weather API request failed with status ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (!(error instanceof Error) || !error.message.startsWith('Weather API')) {
        // Only count metric for unexpected network-level errors, not the HTTP error we just threw
        Sentry.metrics.count('tool_execution_error', 1, {
          attributes: {
            tool: 'get-weather',
            error_type: 'network_error',
          },
        });
        Sentry.captureException(error);
      }
      throw error;
    }
  },
});
