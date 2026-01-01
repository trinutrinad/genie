import { createServerSupabaseClient } from './supabase';

export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Upload image to Supabase Storage
 */
export async function uploadImage(
  file: File,
  bucket: 'profile-photos' | 'work-photos',
  userId: string,
  folder?: string
): Promise<UploadResult> {
  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
  }

  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('File size must be less than 5MB.');
  }

  // Generate unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileExtension = file.name.split('.').pop();
  const fileName = `${timestamp}-${randomString}.${fileExtension}`;
  
  // Create path: bucket/userId/folder/filename
  const path = folder ? `${userId}/${folder}/${fileName}` : `${userId}/${fileName}`;

  // Create Supabase client (server-side)
  const supabase = createServerSupabaseClient();

  // Upload file
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return {
    url: urlData.publicUrl,
    path: data.path,
  };
}

/**
 * Upload multiple images
 */
export async function uploadImages(
  files: File[],
  bucket: 'profile-photos' | 'work-photos',
  userId: string,
  folder?: string
): Promise<UploadResult[]> {
  const uploadPromises = files.map((file) => uploadImage(file, bucket, userId, folder));
  return Promise.all(uploadPromises);
}

/**
 * Delete image from Supabase Storage
 */
export async function deleteImage(
  bucket: 'profile-photos' | 'work-photos',
  path: string
): Promise<void> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

/**
 * Client-side image upload (for use in components)
 */
export async function uploadImageClient(
  file: File,
  bucket: 'profile-photos' | 'work-photos',
  userId: string,
  folder?: string
): Promise<UploadResult> {
  // Create FormData
  const formData = new FormData();
  formData.append('file', file);
  formData.append('bucket', bucket);
  formData.append('userId', userId);
  if (folder) formData.append('folder', folder);

  // Upload via API route
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Upload failed');
  }

  return response.json();
}

