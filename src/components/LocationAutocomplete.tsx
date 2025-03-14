
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Command, CommandInput, CommandList, CommandItem, CommandGroup } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2, MapPin } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

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
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const debouncedValue = useDebounce(inputValue, 500);

  useEffect(() => {
    if (debouncedValue.length < 3) {
      setLocations([]);
      setError(null);
      return;
    }

    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching locations for:', debouncedValue);
        const { data, error } = await supabase.functions.invoke('location-autocomplete', {
          body: { query: debouncedValue }
        });
        
        if (error) {
          console.error('Error fetching locations:', error);
          setError(error.message || 'Failed to fetch locations');
          setLocations([]);
          toast({
            title: "Error",
            description: "Failed to fetch location suggestions",
            variant: "destructive"
          });
          return;
        }

        console.log('Location results:', data);
        
        if (data.error) {
          console.error('API error:', data.error);
          setError(data.error);
          setLocations([]);
          return;
        }
        
        setLocations(data.results || []);
        
        if (data.results && data.results.length === 0 && debouncedValue.length > 3) {
          setError('No locations found');
        }
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
        setError('Failed to fetch location suggestions');
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
            className="bg-white/5 border-white/20 text-white pl-10"
            onFocus={() => setOpen(true)}
          />
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-orange" size={16} />
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
                    <MapPin className="mr-2 h-4 w-4 text-orange" />
                    {location.description}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : (
              <div className="p-4 text-center">
                {error ? (
                  <p className="text-sm text-red-400">{error}</p>
                ) : inputValue.length >= 3 ? (
                  <p className="text-sm text-gray-400">No locations found</p>
                ) : (
                  <p className="text-sm text-gray-400">Type at least 3 characters to search</p>
                )}
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LocationAutocomplete;
