
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const AstrologyEmpty: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-6">
      <h2 className="text-2xl font-semibold mb-4 text-orange">Your Astrological Data</h2>
      <p className="text-white mb-4">Please complete your birth details in your profile to see your astrological data.</p>
      <Button 
        onClick={() => navigate('/profile')}
        className="bg-purple-light hover:bg-purple-light/90 text-white"
      >
        Complete Profile
      </Button>
    </div>
  );
};

export default AstrologyEmpty;
