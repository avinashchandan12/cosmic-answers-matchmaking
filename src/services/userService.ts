
// Simple backend service that uses localStorage for now
// This can be replaced with actual API calls when a backend is implemented

import { toast } from "@/hooks/use-toast";

export interface UserProfile {
  id: string;
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  gender: string;
  email?: string;
  phone?: string;
}

export interface MatchData {
  id: string;
  userId: string;
  partnerId: string;
  userName: string;
  partnerName: string;
  compatibilityScore: number;
  createdAt: string;
}

// User Profiles
export const saveUserProfile = (profile: UserProfile): UserProfile => {
  try {
    // Generate ID if not present
    if (!profile.id) {
      profile.id = generateId();
    }
    
    const profiles = getUserProfiles();
    
    // Check if profile already exists
    const existingIndex = profiles.findIndex(p => p.id === profile.id);
    
    if (existingIndex >= 0) {
      // Update existing profile
      profiles[existingIndex] = profile;
    } else {
      // Add new profile
      profiles.push(profile);
    }
    
    localStorage.setItem('userProfiles', JSON.stringify(profiles));
    toast({
      title: "Profile saved",
      description: "Your profile has been saved successfully."
    });
    
    return profile;
  } catch (error) {
    console.error('Error saving profile:', error);
    toast({
      title: "Error saving profile",
      description: "There was an error saving your profile. Please try again.",
      variant: "destructive"
    });
    throw error;
  }
};

export const getUserProfiles = (): UserProfile[] => {
  try {
    const profilesString = localStorage.getItem('userProfiles');
    return profilesString ? JSON.parse(profilesString) : [];
  } catch (error) {
    console.error('Error getting profiles:', error);
    return [];
  }
};

export const getUserProfileById = (id: string): UserProfile | undefined => {
  const profiles = getUserProfiles();
  return profiles.find(profile => profile.id === id);
};

export const deleteUserProfile = (id: string): boolean => {
  try {
    const profiles = getUserProfiles();
    const filteredProfiles = profiles.filter(profile => profile.id !== id);
    
    localStorage.setItem('userProfiles', JSON.stringify(filteredProfiles));
    toast({
      title: "Profile deleted",
      description: "The profile has been deleted successfully."
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting profile:', error);
    toast({
      title: "Error deleting profile",
      description: "There was an error deleting the profile. Please try again.",
      variant: "destructive"
    });
    return false;
  }
};

// Match Data
export const saveMatchData = (match: Partial<MatchData>): MatchData => {
  try {
    const matchData: MatchData = {
      id: match.id || generateId(),
      userId: match.userId || '',
      partnerId: match.partnerId || '',
      userName: match.userName || '',
      partnerName: match.partnerName || '',
      compatibilityScore: match.compatibilityScore || 0,
      createdAt: match.createdAt || new Date().toISOString(),
    };
    
    const matches = getMatchHistory();
    
    // Check if match already exists
    const existingIndex = matches.findIndex(m => m.id === matchData.id);
    
    if (existingIndex >= 0) {
      // Update existing match
      matches[existingIndex] = matchData;
    } else {
      // Add new match
      matches.push(matchData);
    }
    
    localStorage.setItem('matchHistory', JSON.stringify(matches));
    toast({
      title: "Match saved",
      description: "Your match has been saved successfully."
    });
    
    return matchData;
  } catch (error) {
    console.error('Error saving match:', error);
    toast({
      title: "Error saving match",
      description: "There was an error saving your match. Please try again.",
      variant: "destructive"
    });
    throw error;
  }
};

export const getMatchHistory = (): MatchData[] => {
  try {
    const matchesString = localStorage.getItem('matchHistory');
    return matchesString ? JSON.parse(matchesString) : [];
  } catch (error) {
    console.error('Error getting match history:', error);
    return [];
  }
};

export const getMatchById = (id: string): MatchData | undefined => {
  const matches = getMatchHistory();
  return matches.find(match => match.id === id);
};

export const deleteMatch = (id: string): boolean => {
  try {
    const matches = getMatchHistory();
    const filteredMatches = matches.filter(match => match.id !== id);
    
    localStorage.setItem('matchHistory', JSON.stringify(filteredMatches));
    toast({
      title: "Match deleted",
      description: "The match has been deleted successfully."
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting match:', error);
    toast({
      title: "Error deleting match",
      description: "There was an error deleting the match. Please try again.",
      variant: "destructive"
    });
    return false;
  }
};

// Helper Functions
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
