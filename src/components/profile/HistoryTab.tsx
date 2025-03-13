
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import MatchItem from './MatchItem';

interface Match {
  id: string;
  partner_name: string;
  compatibility_score: number;
  created_at: string;
}

interface HistoryTabProps {
  matches: Match[];
  userName: string;
  onMatchClick: (matchId: string) => void;
}

const HistoryTab = ({ matches, userName, onMatchClick }: HistoryTabProps) => {
  const navigate = useNavigate();

  return (
    <Card className="p-6 bg-white/5 backdrop-blur-lg border-white/20">
      <h2 className="text-2xl font-semibold mb-6">Match History</h2>
      
      {matches.length > 0 ? (
        <div className="space-y-4">
          {matches.map((match) => (
            <MatchItem
              key={match.id}
              match={match}
              userName={userName}
              onClick={onMatchClick}
              showButton={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <img 
            src="/assets/empty-history.png" 
            alt="No history" 
            className="w-32 h-32 mx-auto mb-4 opacity-50"
          />
          <p className="text-gray-400 mb-4">You haven't created any matches yet.</p>
          <Button 
            onClick={() => navigate('/match')}
            className="bg-orange hover:bg-orange/90"
          >
            Create New Match
          </Button>
        </div>
      )}
    </Card>
  );
};

export default HistoryTab;
