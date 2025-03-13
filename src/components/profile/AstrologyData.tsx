
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';

const AstrologyData = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Your Astrological Data</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-gray-400">Rising Sign (Ascendant)</Label>
          <p className="text-lg">Aquarius</p>
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-400">Moon Sign</Label>
          <p className="text-lg">Taurus</p>
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-400">Sun Sign</Label>
          <p className="text-lg">Aries</p>
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-400">Current Dasha</Label>
          <p className="text-lg">Saturn - Mercury</p>
        </div>
      </div>
      
      <div className="mt-6">
        <Button 
          onClick={() => navigate('/chat')}
          className="bg-orange hover:bg-orange/90"
        >
          Ask About Your Chart
        </Button>
      </div>
    </>
  );
};

export default AstrologyData;
