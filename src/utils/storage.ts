
import { supabase } from '@/integrations/supabase/client';

export const uploadAvatar = async (file: File, userId: string): Promise<string | null> => {
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    // Upload the file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file);
      
    if (uploadError) {
      throw uploadError;
    }
    
    // Get the public URL of the file
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);
      
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return null;
  }
};

export const deleteAvatar = async (url: string): Promise<boolean> => {
  try {
    // Extract the file name from the URL
    const fileName = url.split('/').pop();
    
    if (!fileName) return false;
    
    // Delete the file from Supabase storage
    const { error } = await supabase.storage
      .from('avatars')
      .remove([fileName]);
      
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting avatar:', error);
    return false;
  }
};
