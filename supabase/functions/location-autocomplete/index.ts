
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
    // Use the LOCATIONIQ_API_KEY from environment variables
    // We're using a hardcoded key for now as provided by the user
    const LOCATIONIQ_API_KEY = "pk.f9401938330317110a005681ec470985";
    
    if (!LOCATIONIQ_API_KEY) {
      console.error('LocationIQ API key is not set');
      throw new Error('LocationIQ API key is not set');
    }

    console.log('Processing location autocomplete request using LocationIQ');
    const { query } = await req.json();
    
    console.log('Search query:', query);
    
    if (!query || query.length < 3) {
      return new Response(
        JSON.stringify({ results: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use LocationIQ API for autocomplete
    const url = `https://us1.locationiq.com/v1/autocomplete?q=${encodeURIComponent(query)}&key=${LOCATIONIQ_API_KEY}`;
    
    console.log('Fetching from LocationIQ API:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('LocationIQ API error:', response.status, errorText);
      throw new Error(`LocationIQ API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('LocationIQ API response received');
    
    // Check if data is an array before trying to map it
    if (!Array.isArray(data)) {
      console.error('Unexpected response format from LocationIQ:', data);
      return new Response(
        JSON.stringify({ 
          error: 'Unexpected response format from LocationIQ',
          results: [] 
        }),
        { 
          status: 200, // Return 200 even for errors to avoid edge function failure
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Process the response from LocationIQ
    // Format matches our existing frontend expectations
    const detailedResults = data.map(item => ({
      description: item.display_name,
      place_id: item.place_id,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon)
    })).slice(0, 5); // Limit to first 5 results
    
    console.log(`Returning ${detailedResults.length} results with coordinates`);
    return new Response(
      JSON.stringify({ results: detailedResults }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in location-autocomplete function:', error);
    return new Response(
      JSON.stringify({ error: error.message, results: [] }),
      { 
        status: 200, // Return 200 even for errors to avoid edge function failure
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
