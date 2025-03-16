
import React, { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import AstrologyLoading from './AstrologyLoading';
import AstrologyEmpty from './AstrologyEmpty';
import AstrologyError from './AstrologyError';
import AstrologyDataGrid from './AstrologyDataGrid';
import { 
  fetchBirthChart, 
  processChartData, 
  ChartData 
} from '@/utils/astrologyChartUtils';
import { supabase } from '@/integrations/supabase/client';

interface AstrologyDataProps {
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  birthPlaceLat?: number | null;
  birthPlaceLng?: number | null;
  onDataFetched?: () => void;
  shouldRefresh?: boolean;
}

const AstrologyData: React.FC<AstrologyDataProps> = ({ 
  birthDate, 
  birthTime, 
  birthPlace,
  birthPlaceLat,
  birthPlaceLng,
  onDataFetched,
  shouldRefresh = false
}) => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  useEffect(() => {
    // Check if we have the required data to fetch chart
    if (birthDate && birthTime && birthPlaceLat && birthPlaceLng && user) {
      // Only fetch data under these conditions:
      // 1. Data has not been loaded yet
      // 2. shouldRefresh is true (indicating profile was updated)
      if ((!dataLoaded || shouldRefresh) && !loading) {
        console.log("Fetching astrological data...", { shouldRefresh, dataLoaded });
        checkExistingChartData();
      }
    }
  }, [birthDate, birthTime, birthPlaceLat, birthPlaceLng, user, shouldRefresh]);
  
  // First check if chart data already exists in the database
  const checkExistingChartData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Check if chart data already exists in database
      const { data: savedCharts, error: fetchError } = await supabase
        .from('saved_charts')
        .select('*')
        .eq('user_id', user.id)
        .eq('chart_type', 'birth_chart')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (fetchError) {
        console.error('Error checking saved charts:', fetchError);
        fetchChartData(); // Fallback to fetching
        return;
      }
      
      if (savedCharts && savedCharts.length > 0 && !shouldRefresh) {
        // We already have data and don't need to refresh
        console.log('Using existing chart data from database');
        const processedData = processChartData(savedCharts[0].chart_data);
        setChartData(processedData);
        setDataLoaded(true);
        setLoading(false);
        if (onDataFetched) {
          onDataFetched();
        }
      } else {
        // No data found or refresh requested, need to fetch
        fetchChartData();
      }
      
    } catch (error) {
      console.error('Error checking for existing chart data:', error);
      fetchChartData(); // Fallback to fetching
    }
  };
  
  const fetchChartData = async () => {
    if (!birthDate || !birthTime || birthPlaceLat === undefined || birthPlaceLng === undefined || !user) {
      setLoading(false);
      return;
    }
    
    try {
      setError(null);
      setDebugInfo(null);
      
      // Step 1: Fetch birth chart first
      const result = await fetchBirthChart(
        user.id,
        birthDate,
        birthTime,
        birthPlaceLat,
        birthPlaceLng
      );
      
      if (result.error) {
        setError(result.error);
        setDebugInfo(result.debugInfo || null);
        toast({
          title: "Chart Error",
          description: "Unable to calculate your astrological chart. Please try again later.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      const processedData = processChartData(result.data);
      setChartData(processedData);
      setDataLoaded(true);
      
      // Step 2: After birth chart is fetched successfully, then fetch dasha data
      try {
        console.log("Fetching dasha data...");
        // Make a call to the birth-chart edge function with dasha endpoint
        const dashaResult = await supabase.functions.invoke('birth-chart', {
          body: {
            year: parseInt(birthDate.split('-')[0]),
            month: parseInt(birthDate.split('-')[1]),
            date: parseInt(birthDate.split('-')[2]),
            hours: parseInt(birthTime.split(':')[0]),
            minutes: parseInt(birthTime.split(':')[1]),
            seconds: 0,
            latitude: birthPlaceLat,
            longitude: birthPlaceLng,
            timezone: new Date().getTimezoneOffset() / -60,
            endpoint: 'dasha'
          }
        });
        
        if (dashaResult.error) {
          console.error('Error fetching dasha data:', dashaResult.error);
        } else {
          console.log("Dasha data fetched successfully");
          
          // Step 3: Save the dasha data to Supabase
          await supabase
            .from('saved_charts')
            .upsert({
              user_id: user.id,
              chart_type: 'dasha_chart',
              chart_data: dashaResult.data
            });
        }
        
        // Step 4: Now fetch additional divisional charts one by one sequentially
        const chartTypes = ['D9', 'D3', 'D10']; // Add more chart types as needed
        
        for (const chartType of chartTypes) {
          try {
            console.log(`Fetching ${chartType} chart data...`);
            const divChartResult = await supabase.functions.invoke('birth-chart', {
              body: {
                year: parseInt(birthDate.split('-')[0]),
                month: parseInt(birthDate.split('-')[1]),
                date: parseInt(birthDate.split('-')[2]),
                hours: parseInt(birthTime.split(':')[0]),
                minutes: parseInt(birthTime.split(':')[1]),
                seconds: 0,
                latitude: birthPlaceLat,
                longitude: birthPlaceLng,
                timezone: new Date().getTimezoneOffset() / -60,
                endpoint: `chart/${chartType.toLowerCase()}`
              }
            });
            
            if (divChartResult.error) {
              console.error(`Error fetching ${chartType} chart data:`, divChartResult.error);
              continue;
            }
            
            // Save the divisional chart data
            await supabase
              .from('saved_charts')
              .upsert({
                user_id: user.id,
                chart_type: `${chartType.toLowerCase()}_chart`,
                chart_data: divChartResult.data
              });
              
            console.log(`${chartType} chart data saved successfully`);
            
          } catch (chartError) {
            console.error(`Error in ${chartType} chart calculation:`, chartError);
          }
        }
        
        // Notify parent that data fetching is complete
        if (onDataFetched) {
          onDataFetched();
        }
        
      } catch (dashaError: any) {
        console.error('Error in dasha calculation:', dashaError);
      } finally {
        setLoading(false);
      }
      
    } catch (error: any) {
      console.error('Error in chart calculation:', error);
      setError(error.message || 'Unable to calculate your astrological chart');
      toast({
        title: "Chart Error",
        description: "Unable to calculate your astrological chart. Please try again later.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };
  
  if (loading) {
    return <AstrologyLoading />;
  }
  
  if (!birthDate || !birthTime || !birthPlace) {
    return <AstrologyEmpty />;
  }
  
  if (error) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-orange">Your Astrological Data</h2>
        <AstrologyError 
          error={error} 
          onRetry={fetchChartData} 
          debugInfo={debugInfo} 
        />
      </div>
    );
  }
  
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 text-orange">Your Astrological Data</h2>
      <AstrologyDataGrid chartData={chartData || {}} />
    </>
  );
};

export default AstrologyData;
