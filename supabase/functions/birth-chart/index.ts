
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
      throw new Error('Astrology API key is not set');
    }

    const data = await req.json();
    const { year, month, date, hours, minutes, seconds, latitude, longitude, timezone } = data;
    
    // Validate required parameters
    if (!year || !month || !date || hours === undefined || minutes === undefined || 
        seconds === undefined || !latitude || !longitude || timezone === undefined) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Call the Astrology API
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

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      throw new Error(`API error: ${apiResponse.status} - ${errorText}`);
    }

    const chartData = await apiResponse.json();
    
    return new Response(
      JSON.stringify(chartData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in birth-chart function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
