
import React from 'react';
import { Loader2 } from 'lucide-react';

const AstrologyLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className="h-8 w-8 text-orange animate-spin mb-4" />
      <p className="text-white">Calculating your astrological chart...</p>
    </div>
  );
};

export default AstrologyLoading;
