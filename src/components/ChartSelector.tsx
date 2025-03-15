
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Check, ChevronDown } from 'lucide-react';

interface ChartSelectorProps {
  selectedChart: string;
  onSelectChart: (chart: string) => void;
}

const ChartSelector: React.FC<ChartSelectorProps> = ({ selectedChart, onSelectChart }) => {
  const [open, setOpen] = useState(false);

  const charts = [
    { value: "D1", label: "D1 (Rashi) - Birth Chart" },
    { value: "D9", label: "D9 (Navamsha) - Marriage & Spirituality" },
    { value: "D3", label: "D3 (Drekkana) - Siblings & Courage" },
    { value: "D10", label: "D10 (Dashamsha) - Career & Profession" }
  ];

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="bg-purple-light border-white/20 text-white hover:bg-purple-light/80 hover:text-white justify-between w-[220px] md:w-[280px]"
          >
            {selectedChart ? 
              charts.find((chart) => chart.value === selectedChart)?.label || selectedChart
              : "Select chart..."}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 bg-purple-dark border-white/20 text-white w-[220px] md:w-[280px] z-50">
          <Command className="bg-purple-dark rounded-md">
            <CommandGroup>
              {charts.map((chart) => (
                <CommandItem
                  key={chart.value}
                  value={chart.value}
                  onSelect={() => {
                    onSelectChart(chart.value);
                    setOpen(false);
                  }}
                  className="cursor-pointer hover:bg-white/10 text-white"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selectedChart === chart.value ? "opacity-100 text-orange" : "opacity-0"
                    }`}
                  />
                  {chart.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ChartSelector;
