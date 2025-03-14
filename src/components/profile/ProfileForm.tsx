
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Save } from 'lucide-react';
import Avatar from './Avatar';
import LocationAutocomplete from '../LocationAutocomplete';

interface UserProfile {
  id: string;
  name: string;
  gender: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
  avatar_url: string;
}

interface LocationData {
  description: string;
  place_id: string;
  lat: number;
  lng: number;
}

interface ProfileFormProps {
  profile: UserProfile | null;
  avatarUrl: string | null;
  loading: boolean;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLocationSelect: (location: LocationData) => void;
  onSave: () => Promise<void>;
  onCancel: () => void;
}

const ProfileForm = ({
  profile,
  avatarUrl,
  loading,
  onAvatarChange,
  onInputChange,
  onLocationSelect,
  onSave,
  onCancel
}: ProfileFormProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-center mb-6">
        <Avatar url={avatarUrl} editable={true} onFileChange={onAvatarChange} />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="name" className="text-white">Full Name</Label>
        <Input
          id="name"
          name="name"
          value={profile?.name || ''}
          onChange={onInputChange}
          className="bg-white/5 border-white/20 text-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="gender" className="text-white">Gender</Label>
        <Input
          id="gender"
          name="gender"
          value={profile?.gender || ''}
          onChange={onInputChange}
          className="bg-white/5 border-white/20 text-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="birth_date" className="text-white">Birth Date</Label>
        <Input
          id="birth_date"
          name="birth_date"
          type="date"
          value={profile?.birth_date || ''}
          onChange={onInputChange}
          className="bg-white/5 border-white/20 text-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="birth_time" className="text-white">Birth Time</Label>
        <Input
          id="birth_time"
          name="birth_time"
          type="time"
          value={profile?.birth_time || ''}
          onChange={onInputChange}
          className="bg-white/5 border-white/20 text-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="birth_place" className="text-white">Birth Place</Label>
        <LocationAutocomplete
          defaultValue={profile?.birth_place || ''}
          onLocationSelect={onLocationSelect}
          placeholder="City, State, Country"
        />
      </div>
      
      <div className="flex gap-4 pt-4">
        <Button 
          onClick={onSave}
          className="bg-orange hover:bg-orange/90"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2" size={18} />
              Save Changes
            </>
          )}
        </Button>
        <Button 
          onClick={onCancel}
          variant="outline"
          className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ProfileForm;
