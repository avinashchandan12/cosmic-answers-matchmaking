
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import AstrologyDataItem from './AstrologyDataItem';
import { ChartData } from '@/utils/astrologyChartUtils';

interface AstrologyDataGridProps {
  chartData: ChartData;
}

const AstrologyDataGrid: React.FC<AstrologyDataGridProps> = ({ chartData }) => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        <AstrologyDataItem 
          label="Rising Sign (Ascendant)" 
          value={chartData?.ascendant || "Calculating..."}
        />
        
        <AstrologyDataItem 
          label="Moon Sign" 
          value={chartData?.moonSign || "Calculating..."}
        />
        
        <AstrologyDataItem 
          label="Sun Sign" 
          value={chartData?.sunSign || "Calculating..."}
        />
        
        <AstrologyDataItem 
          label="Current Dasha" 
          value={chartData?.currentDasha || "Calculating..."}
        />
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

export default AstrologyDataGrid;
