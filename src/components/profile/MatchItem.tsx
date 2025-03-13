
import React from 'react';
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';

interface MatchItemProps {
  match: {
    id: string;
    partner_name: string;
    compatibility_score: number;
    created_at: string;
  };
  userName: string;
  onClick: (matchId: string) => void;
  showButton?: boolean;
}

const MatchItem = ({ match, userName, onClick, showButton = false }: MatchItemProps) => {
  return (
    <div 
      className="p-4 rounded-lg bg-white/10 hover:bg-white/15 transition-colors cursor-pointer"
      onClick={() => onClick(match.id)}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl mb-1">{userName} & {match.partner_name}</h3>
          <p className="text-gray-400">
            {format(new Date(match.created_at), 'PP')}
          </p>
        </div>
        {showButton ? (
          <Button size="sm" className="bg-purple-light hover:bg-purple">
            View Details
          </Button>
        ) : (
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              match.compatibility_score >= 70 ? 'text-green-400' : 
              match.compatibility_score >= 50 ? 'text-yellow-400' : 
              'text-red-400'
            }`}>
              {match.compatibility_score}%
            </div>
            <p className="text-sm text-gray-400">Compatibility</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchItem;
