
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, chartData, dashaData, currentDateTime } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not set. Please add it to your Supabase project.');
    }

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    // Add the current date and time to the context
    const currentDateTimeString = currentDateTime || new Date().toISOString();
    
    // Prepare the system message for astrology-focused assistant
    let systemMessage = `You are an expert in Vedic astrology with deep knowledge of birth charts, compatibility matching, 
    and astrological predictions. Provide insightful, accurate information about astrological concepts, 
    planetary influences, and relationship compatibility. Your responses should reflect the depth and 
    complexity of Vedic astrological traditions while being accessible to beginners. 
    When discussing compatibility, consider factors like Mangal Dosha, Nakshatras, and planetary positions.
    
    The current date and time is: ${currentDateTimeString}`;

    // Add chart data context if available
    let userMessageWithContext = prompt;
    if (chartData) {
      userMessageWithContext = `My birth chart data: ${JSON.stringify(chartData)}\n\n${prompt}`;
    }
    
    // Add dasha data context if available
    if (dashaData) {
      userMessageWithContext = `My dasha data: ${JSON.stringify(dashaData)}\n\n${userMessageWithContext}`;
      systemMessage += `\n\nYou have access to the user's Dasha periods information, which shows the planetary periods that influence different phases of their life according to Vedic astrology. When asked about past, present, or future phases, refer to the appropriate Dasha and Antardasha (sub-period) information.`;
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessageWithContext }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Error from OpenAI API');
    }

    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-ai function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
