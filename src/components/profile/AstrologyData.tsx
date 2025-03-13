
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';

const AstrologyData = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4 text-orange">Your Astrological Data</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-white/70">Rising Sign (Ascendant)</Label>
          <p className="text-lg text-white">Aquarius</p>
        </div>
        
        <div className="space-y-2">
          <Label className="text-white/70">Moon Sign</Label>
          <p className="text-lg text-white">Taurus</p>
        </div>
        
        <div className="space-y-2">
          <Label className="text-white/70">Sun Sign</Label>
          <p className="text-lg text-white">Aries</p>
        </div>
        
        <div className="space-y-2">
          <Label className="text-white/70">Current Dasha</Label>
          <p className="text-lg text-white">Saturn - Mercury</p>
        </div>
      </div>
      
      <div className="mt-6">
        <Button 
          onClick={() => navigate('/chat')}
          className="bg-purple-light hover:bg-purple-light/90 text-white"
        >
          Ask About Your Chart
        </Button>
      </div>
    </>
  );
};

export default AstrologyData;
