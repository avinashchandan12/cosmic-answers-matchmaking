
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, History, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileTab from '@/components/profile/ProfileTab';
import MatchesTab from '@/components/profile/MatchesTab';
import HistoryTab from '@/components/profile/HistoryTab';

interface UserProfile {
  id: string;
  name: string;
  gender: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
  avatar_url: string;
}

interface Match {
  id: string;
  partner_name: string;
  compatibility_score: number;
  created_at: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchMatches();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching matches:', error);
      } else if (data) {
        setMatches(data);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const viewMatchDetails = (matchId: string) => {
    navigate(`/results/${matchId}`);
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-purple-background flex items-center justify-center">
        <div className="animate-spin text-orange">
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-background text-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <ProfileHeader />

          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white">Your Profile</h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/10 border-white/20">
              <TabsTrigger value="profile" className="data-[state=active]:bg-orange text-white">
                <UserCircle className="mr-2" size={18} />
                Profile
              </TabsTrigger>
              <TabsTrigger value="saved-matches" className="data-[state=active]:bg-orange text-white">
                <Star className="mr-2" size={18} />
                Saved Matches
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-orange text-white">
                <History className="mr-2" size={18} />
                Match History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <ProfileTab 
                profile={profile}
                userId={user.id}
                onProfileUpdate={fetchProfile}
              />
            </TabsContent>
            
            <TabsContent value="saved-matches">
              <MatchesTab
                matches={matches}
                userName={profile?.name || 'You'}
                onMatchClick={viewMatchDetails}
              />
            </TabsContent>
            
            <TabsContent value="history">
              <HistoryTab
                matches={matches}
                userName={profile?.name || 'You'}
                onMatchClick={viewMatchDetails}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
