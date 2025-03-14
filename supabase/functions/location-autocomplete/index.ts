
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
    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');
    
    if (!GOOGLE_MAPS_API_KEY) {
      console.error('Google Maps API key is not set');
      throw new Error('Google Maps API key is not set');
    }

    console.log('Processing location autocomplete request');
    const { query } = await req.json();
    
    console.log('Search query:', query);
    
    if (!query || query.length < 3) {
      return new Response(
        JSON.stringify({ results: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=(cities)&key=${GOOGLE_MAPS_API_KEY}`;
    
    console.log('Fetching from Places API');
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google API error:', response.status, errorText);
      throw new Error(`Google API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Places API response status:', data.status);
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Places API error:', data.status, data.error_message);
      throw new Error(`Places API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }
    
    // Process and get details for the first few predictions to include lat/lng
    const detailedResults = [];
    
    // Only process up to 5 results to avoid too many API calls
    const predictions = data.predictions || [];
    console.log(`Found ${predictions.length} predictions`);
    
    if (predictions.length === 0) {
      return new Response(
        JSON.stringify({ results: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    for (const prediction of predictions.slice(0, 5)) {
      const placeId = prediction.place_id;
      console.log('Getting details for place_id:', placeId);
      
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${GOOGLE_MAPS_API_KEY}`;
      
      const detailsResponse = await fetch(detailsUrl);
      
      if (!detailsResponse.ok) {
        console.error('Failed to fetch place details:', detailsResponse.status);
        continue;
      }
      
      const detailsData = await detailsResponse.json();
      
      if (detailsData.status === 'OK') {
        detailedResults.push({
          description: prediction.description,
          place_id: prediction.place_id,
          lat: detailsData.result.geometry.location.lat,
          lng: detailsData.result.geometry.location.lng
        });
      } else {
        console.error('Place details error:', detailsData.status, detailsData.error_message);
      }
    }

    console.log(`Returning ${detailedResults.length} results with coordinates`);
    return new Response(
      JSON.stringify({ results: detailedResults }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in location-autocomplete function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
