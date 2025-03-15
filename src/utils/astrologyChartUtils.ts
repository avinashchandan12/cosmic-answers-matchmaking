
import { supabase } from '@/integrations/supabase/client';

interface RequestData {
  year: number;
  month: number;
  date: number;
  hours: number;
  minutes: number;
  seconds: number;
  latitude: number | null;
  longitude: number | null;
  timezone: number;
}

export interface ChartData {
  ascendant?: string;
  moonSign?: string;
  sunSign?: string;
  currentDasha?: string;
}

export const fetchBirthChart = async (
  userId: string,
  birthDate: string,
  birthTime: string,
  birthPlaceLat: number | null,
  birthPlaceLng: number | null
): Promise<{ data: any; error: string | null }> => {
  try {
    // Check if chart is already saved in database
    const { data: savedCharts, error: fetchError } = await supabase
      .from('saved_charts')
      .select('*')
      .eq('user_id', userId)
      .eq('chart_type', 'birth_chart')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (fetchError) {
      console.error('Error fetching saved chart:', fetchError);
      return { data: null, error: fetchError.message };
    }
    
    if (savedCharts && savedCharts.length > 0) {
      console.log('Using saved chart data');
      return { data: savedCharts[0].chart_data, error: null };
    }
    
    // Create the request data
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hours, minutes] = birthTime.split(':').map(Number);
    
    const requestData: RequestData = {
      year,
      month,
      date: day,
      hours,
      minutes,
      seconds: 0,
      latitude: birthPlaceLat,
      longitude: birthPlaceLng,
      timezone: new Date().getTimezoneOffset() / -60 // Convert minutes to hours and invert
    };
    
    console.log('Sending birth chart request with data:', requestData);
    
    // Fetch birth chart data
    const { data: planetData, error: planetError } = await supabase.functions.invoke('birth-chart', {
      body: requestData
    });
    
    if (planetError) {
      console.error('Error fetching birth chart:', planetError);
      return { data: null, error: planetError.message };
    }
    
    if (planetData && planetData.error) {
      console.error('Error in birth chart response:', planetData.error);
      return { 
        data: null, 
        error: planetData.error,
        debugInfo: {
          responseError: planetData.error,
          details: planetData.details || planetData.rawResponse,
          requestData: requestData
        }
      };
    }
    
    // Fetch dasha data
    const dashaRequestData = {
      ...requestData,
      endpoint: 'vimsottari/maha-dasas-and-antar-dasas'
    };
    
    const { data: dashaData, error: dashaError } = await supabase.functions.invoke('birth-chart', {
      body: dashaRequestData
    });
    
    if (dashaError) {
      console.error('Error fetching dasha data:', dashaError);
      // We'll continue even if there's a dasha error
    }
    
    // Combine planetary and dasha data
    const combinedData = {
      planets: planetData,
      dashas: dashaData
    };
    
    console.log('Combined chart data:', JSON.stringify(combinedData, null, 2));
    
    // Save data to database
    const { error: saveError } = await supabase
      .from('saved_charts')
      .insert({
        user_id: userId,
        chart_type: 'birth_chart',
        chart_data: combinedData
      });
    
    if (saveError) {
      console.error('Error saving chart data:', saveError);
    }
    
    return { data: combinedData, error: null };
  } catch (error: any) {
    console.error('Error in chart calculation:', error);
    return { data: null, error: error.message || 'Unable to calculate astrological chart' };
  }
};

export const processChartData = (data: any): ChartData => {
  console.log('Processing chart data:', JSON.stringify(data, null, 2));
  
  let ascendant = "Unknown";
  let moonSign = "Unknown";
  let sunSign = "Unknown";
  let currentDasha = "Unknown";
  
  try {
    // Process planet data
    if (data.planets && data.planets.statusCode === 200 && data.planets.output) {
      const planetOutput = data.planets.output;
      
      if (planetOutput.Ascendant) {
        ascendant = planetOutput.Ascendant.zodiac_sign_name;
      }
      
      if (planetOutput.Moon) {
        moonSign = planetOutput.Moon.zodiac_sign_name;
      }
      
      if (planetOutput.Sun) {
        sunSign = planetOutput.Sun.zodiac_sign_name;
      }
    }
    
    // Process dasha data
    if (data.dashas && data.dashas.statusCode === 200 && data.dashas.output) {
      let dashaOutput;
      try {
        // The API returns a stringified JSON for dasha data
        if (typeof data.dashas.output === 'string') {
          dashaOutput = JSON.parse(data.dashas.output);
        } else {
          dashaOutput = data.dashas.output;
        }
        
        const today = new Date();
        
        // Find current dasha
        for (const [mahaDasha, antarDashas] of Object.entries(dashaOutput)) {
          for (const [antarDasha, dateRange] of Object.entries(antarDashas as Record<string, { start_time: string, end_time: string }>)) {
            const startDate = new Date(dateRange.start_time);
            const endDate = new Date(dateRange.end_time);
            
            if (today >= startDate && today <= endDate) {
              currentDasha = `${mahaDasha} - ${antarDasha}`;
              break;
            }
          }
          if (currentDasha !== "Unknown") break;
        }
      } catch (error) {
        console.error('Error parsing dasha data:', error);
      }
    }
    
    console.log('Processed chart data:', { ascendant, moonSign, sunSign, currentDasha });
    
    return {
      ascendant,
      moonSign,
      sunSign,
      currentDasha
    };
  } catch (error) {
    console.error('Error processing chart data:', error);
    return { ascendant, moonSign, sunSign, currentDasha };
  }
};
