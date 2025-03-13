
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, UserCircle, History, Star, LogOut } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

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
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

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
        setAvatarUrl(data.avatar_url);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return null;
    
    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile);
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      return null;
    }
  };

  const saveProfile = async () => {
    try {
      setLoading(true);
      
      let avatarUpdates = {};
      if (avatarFile) {
        const url = await uploadAvatar();
        if (url) {
          avatarUpdates = { avatar_url: url };
        }
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          gender: profile.gender,
          birth_date: profile.birth_date,
          birth_time: profile.birth_time,
          birth_place: profile.birth_place,
          ...avatarUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      
      setIsEditing(false);
      fetchProfile(); // Refresh the profile data
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const viewMatchDetails = (matchId: string) => {
    navigate('/results', { state: { matchId } });
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-dark via-purple to-purple-light flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-b from-purple-dark via-purple to-purple-light text-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
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

          <h1 className="text-3xl md:text-4xl font-bold mb-6">Your Profile</h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/10 border-white/20">
              <TabsTrigger value="profile" className="data-[state=active]:bg-orange">
                <UserCircle className="mr-2" size={18} />
                Profile
              </TabsTrigger>
              <TabsTrigger value="saved-matches" className="data-[state=active]:bg-orange">
                <Star className="mr-2" size={18} />
                Saved Matches
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-orange">
                <History className="mr-2" size={18} />
                Match History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card className="p-6 bg-white/5 backdrop-blur-lg border-white/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Personal Information</h2>
                  {!isEditing && (
                    <Button 
                      onClick={() => setIsEditing(true)}
                      className="bg-orange hover:bg-orange/90"
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
                
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-white/20">
                          {avatarUrl ? (
                            <img 
                              src={avatarUrl} 
                              alt="Avatar" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <UserCircle className="w-16 h-16 text-white/60" />
                            </div>
                          )}
                        </div>
                        <label className="absolute bottom-0 right-0 bg-orange hover:bg-orange/90 rounded-full p-2 cursor-pointer">
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleAvatarChange} 
                            className="hidden" 
                          />
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={profile?.name || ''}
                        onChange={handleInputChange}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Input
                        id="gender"
                        name="gender"
                        value={profile?.gender || ''}
                        onChange={handleInputChange}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="birth_date">Birth Date</Label>
                      <Input
                        id="birth_date"
                        name="birth_date"
                        type="date"
                        value={profile?.birth_date || ''}
                        onChange={handleInputChange}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="birth_time">Birth Time</Label>
                      <Input
                        id="birth_time"
                        name="birth_time"
                        type="time"
                        value={profile?.birth_time || ''}
                        onChange={handleInputChange}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="birth_place">Birth Place</Label>
                      <Input
                        id="birth_place"
                        name="birth_place"
                        value={profile?.birth_place || ''}
                        onChange={handleInputChange}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    
                    <div className="flex gap-4 pt-4">
                      <Button 
                        onClick={saveProfile}
                        className="bg-orange hover:bg-orange/90"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2" size={18} />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button 
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        className="bg-white/10 border-white/20 hover:bg-white/20"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-center mb-6">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-white/20">
                        {profile?.avatar_url ? (
                          <img 
                            src={profile.avatar_url} 
                            alt="Avatar" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <UserCircle className="w-16 h-16 text-white/60" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-400">Full Name</Label>
                        <p className="text-lg">{profile?.name || 'Not provided'}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-gray-400">Gender</Label>
                        <p className="text-lg capitalize">{profile?.gender || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-400">Birth Date</Label>
                        <p className="text-lg">
                          {profile?.birth_date ? 
                            new Date(profile.birth_date).toLocaleDateString() : 
                            'Not provided'}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-gray-400">Birth Time</Label>
                        <p className="text-lg">{profile?.birth_time || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-gray-400">Birth Place</Label>
                      <p className="text-lg">{profile?.birth_place || 'Not provided'}</p>
                    </div>
                  </div>
                )}
              </Card>
              
              <Card className="p-6 mt-6 bg-white/5 backdrop-blur-lg border-white/20">
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
              </Card>
            </TabsContent>
            
            <TabsContent value="saved-matches">
              <Card className="p-6 bg-white/5 backdrop-blur-lg border-white/20">
                <h2 className="text-2xl font-semibold mb-6">Your Saved Matches</h2>
                {matches.length > 0 ? (
                  <div className="space-y-4">
                    {matches.map((match) => (
                      <div 
                        key={match.id}
                        className="p-4 rounded-lg bg-white/10 hover:bg-white/15 transition-colors cursor-pointer"
                        onClick={() => viewMatchDetails(match.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-xl mb-1">{profile?.name} & {match.partner_name}</h3>
                            <p className="text-gray-400">{new Date(match.created_at).toLocaleDateString()}</p>
                          </div>
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
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <img 
                      src="/assets/empty-matches.png" 
                      alt="No matches" 
                      className="w-32 h-32 mx-auto mb-4 opacity-50"
                    />
                    <p className="text-gray-400 mb-4">You haven't saved any matches yet.</p>
                    <Button 
                      onClick={() => navigate('/match')}
                      className="bg-orange hover:bg-orange/90"
                    >
                      Create New Match
                    </Button>
                  </div>
                )}
              </Card>
            </TabsContent>
            
            <TabsContent value="history">
              <Card className="p-6 bg-white/5 backdrop-blur-lg border-white/20">
                <h2 className="text-2xl font-semibold mb-6">Match History</h2>
                
                {matches.length > 0 ? (
                  <div className="space-y-4">
                    {matches.map((match) => (
                      <div 
                        key={match.id}
                        className="p-4 rounded-lg bg-white/10 hover:bg-white/15 transition-colors cursor-pointer"
                        onClick={() => viewMatchDetails(match.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-xl mb-1">{profile?.name} & {match.partner_name}</h3>
                            <p className="text-gray-400">
                              {format(new Date(match.created_at), 'PP')}
                            </p>
                          </div>
                          <Button size="sm" className="bg-purple-light hover:bg-purple">
                            View Details
                          </Button>
                        </div>
                      </div>
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
