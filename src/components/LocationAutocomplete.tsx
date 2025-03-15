
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
  const [showSuggestions, setShowSuggestions] = useState(false);
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
    <div className="relative w-full">
      <div className="relative">
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (e.target.value.length >= 3) {
              setShowSuggestions(true);
            }
          }}
          onFocus={() => {
            if (inputValue.length >= 3) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          className="bg-white/5 border-white/20 text-white pl-10"
          type="text"
        />
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-orange" size={16} />
      </div>

      {showSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-purple-dark border border-white/20 rounded-md shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 text-orange animate-spin" />
            </div>
          ) : locations.length > 0 ? (
            <ul className="py-1">
              {locations.map((location) => (
                <li
                  key={location.place_id}
                  className="px-4 py-2 hover:bg-white/10 cursor-pointer flex items-center"
                  onClick={() => {
                    setInputValue(location.description);
                    onLocationSelect(location);
                    setShowSuggestions(false);
                  }}
                >
                  <MapPin className="mr-2 h-4 w-4 text-orange" />
                  <span>{location.description}</span>
                </li>
              ))}
            </ul>
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
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;
