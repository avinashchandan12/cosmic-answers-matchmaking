
import React from 'react';
import { Label } from "@/components/ui/label";

interface AstrologyDataItemProps {
  label: string;
  value: string;
}

const AstrologyDataItem: React.FC<AstrologyDataItemProps> = ({ label, value }) => {
  return (
    <div className="space-y-2">
      <Label className="text-white/70">{label}</Label>
      <p className="text-lg text-white">{value || "Calculating..."}</p>
    </div>
  );
};

export default AstrologyDataItem;
