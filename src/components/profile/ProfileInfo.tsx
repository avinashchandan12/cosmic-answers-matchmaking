
import React from 'react';
import { Label } from "@/components/ui/label";
import Avatar from './Avatar';

interface UserProfile {
  id: string;
  name: string;
  gender: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
  avatar_url: string;
}

interface ProfileInfoProps {
  profile: UserProfile | null;
}

const ProfileInfo = ({ profile }: ProfileInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-center mb-6">
        <Avatar url={profile?.avatar_url || null} />
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-white/70">Full Name</Label>
          <p className="text-lg text-white">{profile?.name || 'Not provided'}</p>
        </div>
        
        <div className="space-y-2">
          <Label className="text-white/70">Gender</Label>
          <p className="text-lg capitalize text-white">{profile?.gender || 'Not provided'}</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-white/70">Birth Date</Label>
          <p className="text-lg text-white">
            {profile?.birth_date ? 
              new Date(profile.birth_date).toLocaleDateString() : 
              'Not provided'}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label className="text-white/70">Birth Time</Label>
          <p className="text-lg text-white">{profile?.birth_time || 'Not provided'}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="text-white/70">Birth Place</Label>
        <p className="text-lg text-white">{profile?.birth_place || 'Not provided'}</p>
      </div>
    </div>
  );
};

export default ProfileInfo;
