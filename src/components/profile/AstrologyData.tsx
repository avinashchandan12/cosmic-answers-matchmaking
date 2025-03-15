
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface AstrologyDataProps {
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  birthPlaceLat?: number | null;
  birthPlaceLng?: number | null;
}

interface ChartData {
  ascendant?: string;
  moonSign?: string;
  sunSign?: string;
  currentDasha?: string;
}

const AstrologyData: React.FC<AstrologyDataProps> = ({ 
  birthDate, 
  birthTime, 
  birthPlace,
  birthPlaceLat,
  birthPlaceLng
}) => {
  const navigate = useNavigate();
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
    if (!birthDate || !birthTime || birthPlaceLat === undefined || birthPlaceLng === undefined) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setDebugInfo(null);
      
      const { data: savedCharts, error: fetchError } = await supabase
        .from('saved_charts')
        .select('*')
        .eq('user_id', user?.id)
        .eq('chart_type', 'birth_chart')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (fetchError) {
        console.error('Error fetching saved chart:', fetchError);
        throw fetchError;
      }
      
      if (savedCharts && savedCharts.length > 0) {
        processChartData(savedCharts[0].chart_data);
        return;
      }
      
      const [year, month, day] = birthDate.split('-').map(Number);
      const [hours, minutes] = birthTime.split(':').map(Number);
      
      const requestData = {
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
        setDebugInfo({
          error: planetError,
          requestData: requestData
        });
        throw planetError;
      }
      
      if (planetData && planetData.error) {
        console.error('Error in birth chart response:', planetData.error);
        setDebugInfo({
          responseError: planetData.error,
          details: planetData.details || planetData.rawResponse,
          requestData: requestData
        });
        throw new Error(planetData.error);
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
        // Don't fail completely if dasha data fetch fails
      }
      
      // Combine planetary and dasha data
      const combinedData = {
        planets: planetData,
        dashas: dashaData
      };
      
      console.log('Combined chart data:', JSON.stringify(combinedData, null, 2));
      
      const { error: saveError } = await supabase
        .from('saved_charts')
        .insert({
          user_id: user?.id,
          chart_type: 'birth_chart',
          chart_data: combinedData
        });
      
      if (saveError) {
        console.error('Error saving chart data:', saveError);
      }
      
      processChartData(combinedData);
      
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
  
  const processChartData = (data: any) => {
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
      
      setChartData({
        ascendant,
        moonSign,
        sunSign,
        currentDasha
      });
    } catch (error) {
      console.error('Error processing chart data:', error);
      setError('Unable to process your chart data');
      toast({
        title: "Processing Error",
        description: "Unable to process your chart data. Please try again later.",
        variant: "destructive"
      });
    }
  };
  
  const handleRetry = () => {
    fetchChartData();
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 text-orange animate-spin mb-4" />
        <p className="text-white">Calculating your astrological chart...</p>
      </div>
    );
  }
  
  if (!birthDate || !birthTime || !birthPlace) {
    return (
      <div className="text-center py-6">
        <h2 className="text-2xl font-semibold mb-4 text-orange">Your Astrological Data</h2>
        <p className="text-white mb-4">Please complete your birth details in your profile to see your astrological data.</p>
        <Button 
          onClick={() => navigate('/profile')}
          className="bg-purple-light hover:bg-purple-light/90 text-white"
        >
          Complete Profile
        </Button>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4 text-orange">Your Astrological Data</h2>
        
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
        
        <div className="text-center mt-4">
          <Button 
            onClick={handleRetry}
            className="bg-purple-light hover:bg-purple-light/90 text-white"
          >
            Try Again
          </Button>
        </div>
        
        {debugInfo && (
          <div className="mt-6 p-4 border border-white/10 rounded-md bg-black/20">
            <h3 className="text-sm font-medium text-white/70 mb-2">Debug Information</h3>
            <pre className="text-xs text-white/60 overflow-auto max-h-40">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 text-orange">Your Astrological Data</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-white/70">Rising Sign (Ascendant)</Label>
          <p className="text-lg text-white">{chartData?.ascendant || "Calculating..."}</p>
        </div>
        
        <div className="space-y-2">
          <Label className="text-white/70">Moon Sign</Label>
          <p className="text-lg text-white">{chartData?.moonSign || "Calculating..."}</p>
        </div>
        
        <div className="space-y-2">
          <Label className="text-white/70">Sun Sign</Label>
          <p className="text-lg text-white">{chartData?.sunSign || "Calculating..."}</p>
        </div>
        
        <div className="space-y-2">
          <Label className="text-white/70">Current Dasha</Label>
          <p className="text-lg text-white">{chartData?.currentDasha || "Calculating..."}</p>
        </div>
      </div>
      
      <div className="mt-6">
        <Button 
          onClick={() => navigate('/chat')}
          className="bg-purple-light hover:bg-purple-light/90 text-white"
        >
          Ask About Your Chart
        </Button>
      </div>
    </>
  );
};

export default AstrologyData;
