
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
    const ASTRO_API_KEY = Deno.env.get('ASTRO_API_KEY');
    
    if (!ASTRO_API_KEY) {
      console.error('ASTRO_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'Astrology API key is not set' }),
        { 
          status: 200, // Return 200 even for config errors
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await req.json();
    console.log('Received birth chart request with data:', JSON.stringify(data));
    
    const { year, month, date, hours, minutes, seconds, latitude, longitude, timezone } = data;
    
    // Validate required parameters
    if (!year || !month || !date || hours === undefined || minutes === undefined || 
        seconds === undefined || !latitude || !longitude || timezone === undefined) {
      console.error('Missing required parameters:', JSON.stringify(data));
      return new Response(
        JSON.stringify({ 
          error: 'Missing required parameters',
          params: { year, month, date, hours, minutes, seconds, latitude, longitude, timezone }
        }),
        { 
          status: 200, // Return 200 even for validation errors
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Call the Astrology API
    console.log('Calling astrology API with params:', JSON.stringify({
      year, month, date, hours, minutes, seconds, latitude, longitude, timezone
    }));
    
    const apiResponse = await fetch('https://json.apiastro.com/planets/extended', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ASTRO_API_KEY
      },
      body: JSON.stringify({
        year, month, date, hours, minutes, seconds, latitude, longitude, timezone
      })
    });

    const responseStatus = apiResponse.status;
    const responseText = await apiResponse.text();
    console.log(`API response status: ${responseStatus}`);
    
    if (!apiResponse.ok) {
      console.error(`API error (${responseStatus}): ${responseText}`);
      return new Response(
        JSON.stringify({ 
          error: `API error: ${responseStatus}`,
          details: responseText
        }),
        { 
          status: 200, // Return 200 even for API errors
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let chartData;
    try {
      chartData = JSON.parse(responseText);
      console.log('Successfully parsed chart data');
    } catch (parseError) {
      console.error('Error parsing API response:', parseError);
      return new Response(
        JSON.stringify({ 
          error: 'Error parsing API response',
          rawResponse: responseText
        }),
        { 
          status: 200, // Return 200 even for parsing errors
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    return new Response(
      JSON.stringify(chartData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in birth-chart function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }),
      { 
        status: 200, // Return 200 even for unexpected errors
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
