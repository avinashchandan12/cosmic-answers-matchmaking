
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProfileHeader = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <Button 
        onClick={() => navigate(-1)}
        className="bg-white/10 hover:bg-white/20 text-white"
      >
        <ArrowLeft className="mr-2" size={18} />
        Back
      </Button>
      
      <Button 
        onClick={handleSignOut}
        className="bg-red-500/80 hover:bg-red-500 text-white"
      >
        <LogOut className="mr-2" size={18} />
        Sign Out
      </Button>
    </div>
  );
};

export default ProfileHeader;
