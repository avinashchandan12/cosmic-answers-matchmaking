
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
  const [dashaData, setDashaData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  useEffect(() => {
    // Only fetch data once when component mounts or when shouldRefresh is true
    if ((birthDate && birthTime && birthPlaceLat && birthPlaceLng && user && !dataLoaded) || shouldRefresh) {
      console.log("Fetching astrological data...", { shouldRefresh, dataLoaded });
      fetchChartData();
    }
  }, [birthDate, birthTime, birthPlaceLat, birthPlaceLng, user, shouldRefresh]);
  
  const fetchChartData = async () => {
    if (!birthDate || !birthTime || birthPlaceLat === undefined || birthPlaceLng === undefined || !user) {
      return;
    }
    
    try {
      setLoading(true);
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
          setDashaData(dashaResult.data);
          
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
      }
      
    } catch (error: any) {
      console.error('Error in chart calculation:', error);
      setError(error.message || 'Unable to calculate your astrological chart');
      toast({
        title: "Chart Error",
        description: "Unable to calculate your astrological chart. Please try again later.",
        variant: "destructive"
      });
    } finally {
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
