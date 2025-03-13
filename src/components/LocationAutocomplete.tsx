
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Command, CommandInput, CommandList, CommandItem, CommandGroup } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2 } from 'lucide-react';
import { GOOGLE_MAPS_API_KEY } from '@/config/api';
import { useDebounce } from '@/hooks/use-debounce';

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
        
        // In a real app, we would make a call to a secure backend that proxies Google Maps API
        // For demo purposes, we're using a mock response
        // In production, replace this with a real API call
        
        // Mock response while we wait for API key setup
        const mockResponse = [
          {
            description: "New York, NY, USA",
            place_id: "mock-place-id-1",
            lat: 40.7128,
            lng: -74.0060
          },
          {
            description: "New Delhi, Delhi, India",
            place_id: "mock-place-id-2",
            lat: 28.6139,
            lng: 77.2090
          },
          {
            description: "New Orleans, LA, USA",
            place_id: "mock-place-id-3",
            lat: 29.9511,
            lng: -90.0715
          }
        ].filter(location => 
          location.description.toLowerCase().includes(debouncedValue.toLowerCase())
        );
        
        setLocations(mockResponse);
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
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
