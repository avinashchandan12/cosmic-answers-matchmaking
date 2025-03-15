
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ProfileForm from './ProfileForm';
import ProfileInfo from './ProfileInfo';
import AstrologyData from './AstrologyData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  name: string;
  gender: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
  birth_place_lat: number | null;
  birth_place_lng: number | null;
  avatar_url: string;
}

interface ProfileTabProps {
  profile: UserProfile | null;
  userId: string;
  onProfileUpdate: () => void;
}

const ProfileTab = ({ profile, userId, onProfileUpdate }: ProfileTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editableProfile, setEditableProfile] = useState<UserProfile | null>(profile);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [birthPlaceData, setBirthPlaceData] = useState<{lat: number | null, lng: number | null}>({
    lat: profile?.birth_place_lat || null,
    lng: profile?.birth_place_lng || null
  });
  const [updatingAstrology, setUpdatingAstrology] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableProfile((prev) => ({ ...prev, [name]: value } as UserProfile));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const handleLocationSelect = (location: {description: string, lat: number, lng: number}) => {
    setEditableProfile(prev => ({
      ...prev,
      birth_place: location.description,
    } as UserProfile));
    
    setBirthPlaceData({
      lat: location.lat,
      lng: location.lng
    });
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return null;
    
    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile);
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return null;
    }
  };

  const handleAstrologyDataUpdate = () => {
    setUpdatingAstrology(false);
    // Refresh the profile data
    onProfileUpdate();
    
    toast({
      title: "Astrology Data Updated",
      description: "Your astrological data has been refreshed based on your new profile information.",
    });
  };

  const saveProfile = async () => {
    if (!editableProfile) return;
    
    try {
      setLoading(true);
      
      let avatarUpdates = {};
      if (avatarFile) {
        const url = await uploadAvatar();
        if (url) {
          avatarUpdates = { avatar_url: url };
        }
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          name: editableProfile.name,
          gender: editableProfile.gender,
          birth_date: editableProfile.birth_date,
          birth_time: editableProfile.birth_time,
          birth_place: editableProfile.birth_place,
          birth_place_lat: birthPlaceData.lat,
          birth_place_lng: birthPlaceData.lng,
          ...avatarUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully. Refreshing astrological data...",
      });
      
      // Trigger astrology data update
      setIsEditing(false);
      setUpdatingAstrology(true);
      
      // Delete existing chart data so it will be recalculated
      await supabase
        .from('saved_charts')
        .delete()
        .eq('user_id', userId);
      
      // Profile has been updated, but we won't call onProfileUpdate() yet
      // We'll wait for the astrology data to be updated first
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="p-6 bg-white/5 backdrop-blur-lg border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-orange">Personal Information</h2>
          {!isEditing && (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-orange hover:bg-orange/90"
            >
              Edit Profile
            </Button>
          )}
        </div>
        
        {isEditing ? (
          <ProfileForm 
            profile={editableProfile}
            avatarUrl={avatarUrl}
            loading={loading}
            onAvatarChange={handleAvatarChange}
            onInputChange={handleInputChange}
            onLocationSelect={handleLocationSelect}
            onSave={saveProfile}
            onCancel={() => {
              setIsEditing(false);
              setEditableProfile(profile);
              setAvatarUrl(profile?.avatar_url || null);
              setAvatarFile(null);
              setBirthPlaceData({
                lat: profile?.birth_place_lat || null,
                lng: profile?.birth_place_lng || null
              });
            }}
          />
        ) : (
          <ProfileInfo profile={profile} />
        )}
      </Card>
      
      <Card className="p-6 mt-6 bg-white/5 backdrop-blur-lg border-white/20">
        {updatingAstrology ? (
          <div className="py-4 text-center">
            <AstrologyLoading />
            <p className="mt-2 text-white/70">Updating your astrological data based on your new profile information...</p>
          </div>
        ) : (
          <AstrologyData 
            birthDate={profile?.birth_date}
            birthTime={profile?.birth_time}
            birthPlace={profile?.birth_place}
            birthPlaceLat={profile?.birth_place_lat}
            birthPlaceLng={profile?.birth_place_lng}
            onDataFetched={handleAstrologyDataUpdate}
          />
        )}
      </Card>
    </>
  );
};

export default ProfileTab;
