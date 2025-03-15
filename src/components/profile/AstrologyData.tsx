
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
