
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, UserCircle, History, Star } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';

interface UserProfile {
  name: string;
  gender: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}

const initialProfile: UserProfile = {
  name: '',
  gender: '',
  birthDate: '',
  birthTime: '',
  birthPlace: ''
};

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [savedMatches, setSavedMatches] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load profile from localStorage on component mount
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    // Load saved matches (in a real app, this would come from a database)
    const savedMatchesData = localStorage.getItem('savedMatches');
    if (savedMatchesData) {
      setSavedMatches(JSON.parse(savedMatchesData));
    } else {
      // Mock data if no saved matches
      setSavedMatches([
        { 
          id: 1, 
          date: '2023-10-15',
          user: 'You',
          partner: 'Aisha',
          compatibilityScore: 78
        },
        { 
          id: 2, 
          date: '2023-09-22',
          user: 'You',
          partner: 'Michael',
          compatibilityScore: 65
        }
      ]);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const saveProfile = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const viewMatchDetails = (matchId: number) => {
    navigate('/results', { state: { matchId } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-dark via-purple to-purple-light text-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <Button 
            onClick={() => navigate(-1)}
            className="mb-6 bg-white/10 hover:bg-white/20 text-white"
          >
            <ArrowLeft className="mr-2" size={18} />
            Back
          </Button>

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
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Input
                        id="gender"
                        name="gender"
                        value={profile.gender}
                        onChange={handleInputChange}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Birth Date</Label>
                      <Input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        value={profile.birthDate}
                        onChange={handleInputChange}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="birthTime">Birth Time</Label>
                      <Input
                        id="birthTime"
                        name="birthTime"
                        type="time"
                        value={profile.birthTime}
                        onChange={handleInputChange}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="birthPlace">Birth Place</Label>
                      <Input
                        id="birthPlace"
                        name="birthPlace"
                        value={profile.birthPlace}
                        onChange={handleInputChange}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    
                    <div className="flex gap-4 pt-4">
                      <Button 
                        onClick={saveProfile}
                        className="bg-orange hover:bg-orange/90"
                      >
                        <Save className="mr-2" size={18} />
                        Save Changes
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
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-400">Full Name</Label>
                        <p className="text-lg">{profile.name || 'Not provided'}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-gray-400">Gender</Label>
                        <p className="text-lg capitalize">{profile.gender || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-400">Birth Date</Label>
                        <p className="text-lg">
                          {profile.birthDate ? new Date(profile.birthDate).toLocaleDateString() : 'Not provided'}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-gray-400">Birth Time</Label>
                        <p className="text-lg">{profile.birthTime || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-gray-400">Birth Place</Label>
                      <p className="text-lg">{profile.birthPlace || 'Not provided'}</p>
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
                {savedMatches.length > 0 ? (
                  <div className="space-y-4">
                    {savedMatches.map((match) => (
                      <div 
                        key={match.id}
                        className="p-4 rounded-lg bg-white/10 hover:bg-white/15 transition-colors cursor-pointer"
                        onClick={() => viewMatchDetails(match.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-xl mb-1">{match.user} & {match.partner}</h3>
                            <p className="text-gray-400">{new Date(match.date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-center">
                            <div className={`text-2xl font-bold ${match.compatibilityScore >= 70 ? 'text-green-400' : match.compatibilityScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {match.compatibilityScore}%
                            </div>
                            <p className="text-sm text-gray-400">Compatibility</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
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
                
                {savedMatches.length > 0 ? (
                  <div className="space-y-4">
                    {savedMatches.map((match) => (
                      <div 
                        key={match.id}
                        className="p-4 rounded-lg bg-white/10 hover:bg-white/15 transition-colors cursor-pointer"
                        onClick={() => viewMatchDetails(match.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-xl mb-1">{match.user} & {match.partner}</h3>
                            <p className="text-gray-400">{new Date(match.date).toLocaleDateString()}</p>
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
