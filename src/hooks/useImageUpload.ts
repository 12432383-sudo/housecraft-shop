import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const generateSecureFileName = (folder: string, extension: string): string => {
  const uuid = crypto.randomUUID();
  return `${folder}/${uuid}.${extension}`;
};

const validateFile = (file: File): { valid: boolean; error?: string } => {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size must be under 10MB' };
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only JPG, PNG, GIF, and WebP images are allowed' };
  }
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
    return { valid: false, error: 'Invalid file extension' };
  }
  return { valid: true };
};

const getUserFriendlyErrorMessage = (error: any): string => {
  const errorMessage = error?.message?.toLowerCase() || '';
  if (errorMessage.includes('unauthorized') || errorMessage.includes('auth')) {
    return 'Please sign in to upload images';
  }
  if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
    return 'Storage limit reached. Please try again later';
  }
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return 'Connection issue. Please check your internet and try again';
  }
  if (errorMessage.includes('bucket') || errorMessage.includes('storage')) {
    return 'Unable to upload image. Please try again';
  }
  return 'Upload failed. Please try again';
};

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const uploadImage = async (file: File, folder: string = 'products'): Promise<string | null> => {
    const validation = validateFile(file);
    if (!validation.valid) {
      toast({
        title: 'Invalid file',
        description: validation.error,
        variant: 'destructive',
      });
      return null;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = generateSecureFileName(folder, fileExt);

      setUploadProgress(30);

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      setUploadProgress(80);

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      setUploadProgress(100);
      return publicUrl;
    } catch (error: any) {
      if (import.meta.env.DEV) console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: getUserFriendlyErrorMessage(error),
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadMultipleImages = async (files: File[], folder: string = 'products'): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of files) {
      const url = await uploadImage(file, folder);
      if (url) urls.push(url);
    }
    return urls;
  };

  const deleteImage = async (url: string): Promise<boolean> => {
    try {
      const urlParts = url.split('/product-images/');
      if (urlParts.length < 2) return false;
      const filePath = urlParts[1];
      const { error } = await supabase.storage
        .from('product-images')
        .remove([filePath]);
      if (error) throw error;
      return true;
    } catch (error: any) {
      if (import.meta.env.DEV) console.error('Delete error:', error);
      return false;
    }
  };

  return {
    uploadImage,
    uploadMultipleImages,
    deleteImage,
    isUploading,
    uploadProgress,
    validateFile,
  };
};
