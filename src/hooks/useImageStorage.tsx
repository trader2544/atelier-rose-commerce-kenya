import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useImageStorage = () => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File, folder: string = 'products') => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const getImageUrl = (path: string) => {
    if (!path) return null;
    
    // If it's already a full URL, return it
    if (path.startsWith('http')) {
      return path;
    }

    // Otherwise, get public URL from Supabase
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(path);

    return data.publicUrl;
  };

  return {
    uploadImage,
    getImageUrl,
    uploading
  };
};
