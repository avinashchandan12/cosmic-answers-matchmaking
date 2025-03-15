
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
}

const AstrologyData: React.FC<AstrologyDataProps> = ({ 
  birthDate, 
  birthTime, 
  birthPlace,
  birthPlaceLat,
  birthPlaceLng
}) => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [dashaData, setDashaData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  useEffect(() => {
    if (birthDate && birthTime && birthPlaceLat && birthPlaceLng && user) {
      fetchChartData();
    }
  }, [birthDate, birthTime, birthPlaceLat, birthPlaceLng, user]);
  
  const fetchChartData = async () => {
    if (!birthDate || !birthTime || birthPlaceLat === undefined || birthPlaceLng === undefined || !user) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setDebugInfo(null);
      
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
        return;
      }
      
      const processedData = processChartData(result.data);
      setChartData(processedData);
      
      // Fetch dasha data as well
      try {
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
          setDashaData(dashaResult.data);
          
          // Save the dasha data to Supabase
          await supabase
            .from('saved_charts')
            .upsert({
              user_id: user.id,
              chart_type: 'dasha_chart',
              chart_data: dashaResult.data
            });
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
