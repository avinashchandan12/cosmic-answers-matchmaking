
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown } from 'lucide-react';

interface ChartOption {
  id: string;
  name: string;
}

interface ChartSelectorProps {
  selectedChart: string;
  onSelectChart: (chartId: string) => void;
}

const ChartSelector: React.FC<ChartSelectorProps> = ({ 
  selectedChart, 
  onSelectChart 
}) => {
  const chartOptions: ChartOption[] = [
    { id: 'D1', name: 'D1 Rashi (Birth Chart)' },
    { id: 'D9', name: 'D9 Navamsha (Marriage)' },
    { id: 'D3', name: 'D3 Drekkana (Siblings)' },
    { id: 'D10', name: 'D10 Dashamsha (Career)' },
    { id: 'D7', name: 'D7 Saptamsha (Children)' },
    { id: 'D2', name: 'D2 Hora (Wealth)' },
    { id: 'D4', name: 'D4 Chaturthamsha (Property)' },
    { id: 'D12', name: 'D12 Dwadashamsha (Parents)' },
    { id: 'D5', name: 'D5 Panchamsha (Spiritual Merit)' },
    { id: 'D6', name: 'D6 Shashthamsha (Health)' },
    { id: 'D8', name: 'D8 Ashtamsha (Obstacles)' },
    { id: 'D11', name: 'D11 Rudramsha (Dharma)' },
    { id: 'D16', name: 'D16 Shodashamsha (Vehicles)' },
  ];

  const selectedChartName = chartOptions.find(chart => chart.id === selectedChart)?.name || selectedChart;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="text-white bg-white/10 border-white/20 hover:bg-white/20">
          <span className="mr-1">Chart:</span> {selectedChartName}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-purple-800 border-white/20 text-white">
        {chartOptions.map((chart) => (
          <DropdownMenuItem
            key={chart.id}
            className={`flex items-center justify-between cursor-pointer ${
              selectedChart === chart.id ? 'bg-white/10' : ''
            } hover:bg-white/20`}
            onClick={() => onSelectChart(chart.id)}
          >
            {chart.name}
            {selectedChart === chart.id && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChartSelector;
