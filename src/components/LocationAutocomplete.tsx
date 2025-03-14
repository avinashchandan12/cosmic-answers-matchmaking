
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Command, CommandInput, CommandList, CommandItem, CommandGroup } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { supabase } from '@/integrations/supabase/client';

export interface LocationData {
  description: string;
  place_id: string;
  lat: number;
  lng: number;
}

interface LocationAutocompleteProps {
  defaultValue?: string;
  onLocationSelect: (location: LocationData) => void;
  placeholder?: string;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  defaultValue = '',
  onLocationSelect,
  placeholder = 'Enter a location'
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debouncedValue = useDebounce(inputValue, 500);

  useEffect(() => {
    if (debouncedValue.length < 3) {
      setLocations([]);
      return;
    }

    const fetchLocations = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase.functions.invoke('location-autocomplete', {
          body: { query: debouncedValue }
        });
        
        if (error) {
          console.error('Error fetching locations:', error);
          setLocations([]);
          return;
        }
        
        setLocations(data.results || []);
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [debouncedValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="bg-white/5 border-white/20 text-white"
            onFocus={() => setOpen(true)}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 bg-purple-light border-white/20 text-white w-full min-w-[240px]" align="start">
        <Command className="bg-transparent">
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 text-orange animate-spin" />
              </div>
            ) : locations.length > 0 ? (
              <CommandGroup>
                {locations.map((location) => (
                  <CommandItem
                    key={location.place_id}
                    onSelect={() => {
                      setInputValue(location.description);
                      onLocationSelect(location);
                      setOpen(false);
                    }}
                    className="cursor-pointer hover:bg-white/10"
                  >
                    {location.description}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : inputValue.length >= 3 ? (
              <p className="p-4 text-center text-sm text-gray-400">No locations found</p>
            ) : (
              <p className="p-4 text-center text-sm text-gray-400">Type at least 3 characters to search</p>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LocationAutocomplete;
