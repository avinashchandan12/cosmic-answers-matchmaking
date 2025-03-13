
import { supabase } from '@/integrations/supabase/client';

// Profile types
export interface Profile {
  id: string;
  name: string;
  gender: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
  birth_place_lat: number | null;
  birth_place_lng: number | null;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

// Match types
export interface Match {
  id: string;
  user_id: string;
  partner_name: string;
  partner_birth_date: string;
  partner_birth_time: string;
  partner_birth_place: string;
  partner_birth_place_lat: number | null;
  partner_birth_place_lng: number | null;
  compatibility_score: number;
  created_at: string;
}

// Chat message types
export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  is_from_ai: boolean;
  created_at: string;
}

// Saved chart types
export interface SavedChart {
  id: string;
  user_id: string;
  chart_type: string;
  chart_data: any;
  chart_image_url: string | null;
  created_at: string;
}

// Profile operations
export const getProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select()
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

export const updateProfile = async (profile: Partial<Profile> & { id: string }): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        ...profile,
        updated_at: new Date().toISOString()
      })
      .eq('id', profile.id);
      
    if (error) {
      console.error('Error updating profile:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating profile:', error);
    return false;
  }
};

// Match operations
export const saveMatch = async (match: { 
  user_id: string; 
  partner_name: string; 
  partner_birth_date?: string;
  partner_birth_time?: string;
  partner_birth_place?: string;
  partner_birth_place_lat?: number | null;
  partner_birth_place_lng?: number | null;
  compatibility_score?: number;
  created_at?: string;
  id?: string;
}): Promise<Match | null> => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .insert(match)
      .select()
      .single();
      
    if (error) {
      console.error('Error saving match:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error saving match:', error);
    return null;
  }
};

export const getMatches = async (userId: string): Promise<Match[]> => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select()
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching matches:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
};

export const getMatchById = async (matchId: string): Promise<Match | null> => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select()
      .eq('id', matchId)
      .single();
      
    if (error) {
      console.error('Error fetching match:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching match:', error);
    return null;
  }
};

// Chat operations
export const getChatMessages = async (userId: string): Promise<ChatMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select()
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
      
    if (error) {
      console.error('Error fetching chat messages:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return [];
  }
};

export const saveChatMessage = async (message: {
  user_id: string;
  message: string;
  is_from_ai?: boolean;
  created_at?: string;
  id?: string;
}): Promise<ChatMessage | null> => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert(message)
      .select()
      .single();
      
    if (error) {
      console.error('Error saving chat message:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error saving chat message:', error);
    return null;
  }
};

// Saved charts operations
export const saveChart = async (chart: Omit<SavedChart, 'id' | 'created_at'>): Promise<SavedChart | null> => {
  try {
    const { data, error } = await supabase
      .from('saved_charts')
      .insert(chart)
      .select()
      .single();
      
    if (error) {
      console.error('Error saving chart:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error saving chart:', error);
    return null;
  }
};

export const getSavedCharts = async (userId: string): Promise<SavedChart[]> => {
  try {
    const { data, error } = await supabase
      .from('saved_charts')
      .select()
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching saved charts:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching saved charts:', error);
    return [];
  }
};
