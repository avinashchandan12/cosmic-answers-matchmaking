
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
    const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');
    
    if (!DEEPSEEK_API_KEY) {
      throw new Error('DeepSeek API key is not set');
    }

    const { question, chartData } = await req.json();
    
    if (!question) {
      return new Response(
        JSON.stringify({ error: 'Question is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Prepare the context with chart data if available
    let context = "Please answer the following astrology-related question based on Vedic astrology principles.";
    
    if (chartData) {
      context = `Please analyze the following birth chart data and answer the question based on Vedic astrology principles. Here is the birth chart data in JSON format: ${JSON.stringify(chartData)}`;
    }

    // Call the DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are an expert Vedic astrologer with deep knowledge of birth charts, planetary positions, and astrological interpretations. Provide detailed and insightful answers to questions about astrology, horoscopes, and birth charts."
          },
          {
            role: "user",
            content: `${context}\n\nQuestion: ${question}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;
    
    return new Response(
      JSON.stringify({ answer }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in astro-ai function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
