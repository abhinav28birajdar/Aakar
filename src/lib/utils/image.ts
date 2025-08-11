// src/lib/utils/image.ts
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { supabase } from '../supabase';

export async function getAssetBase64(uri: string): Promise<string> {
  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  return base64;
}

export async function resizeImageForUpload(uri: string, maxWidth: number, quality: number = 0.9): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: maxWidth } }],
    { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
}

export async function uploadImageToSupabaseStorage(filePath: string, fileData: string, bucket: string, contentType: string = 'image/jpeg'): Promise<string> {
  const { data, error } = await supabase.storage.from(bucket).upload(filePath, fileData, {
    contentType,
    upsert: true,
  });
  if (error) throw error;
  return data?.path || '';
}
