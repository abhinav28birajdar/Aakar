import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { supabase } from '../supabase';

interface ImageDimensions {
  width: number;
  height: number;
}

interface ImageManipulationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: ImageManipulator.SaveFormat;
}

// Get base64 string from uri
export async function getAssetBase64(uri: string): Promise<string> {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, { 
      encoding: FileSystem.EncodingType.Base64 
    });
    return base64;
  } catch (error) {
    console.error('Error reading file as base64:', error);
    throw new Error('Failed to read image data');
  }
}

// Resize and optimize image
export async function resizeAndOptimizeImage(
  uri: string,
  options: ImageManipulationOptions = {}
): Promise<string> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.9,
    format = ImageManipulator.SaveFormat.JPEG
  } = options;

  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: maxWidth, height: maxHeight } }],
      { compress: quality, format }
    );
    return result.uri;
  } catch (error) {
    console.error('Error manipulating image:', error);
    throw new Error('Failed to process image');
  }
}

// Crop image with specified dimensions
export async function cropImage(
  uri: string,
  crop: { x: number; y: number; width: number; height: number }
): Promise<string> {
  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{
        crop: {
          originX: crop.x,
          originY: crop.y,
          width: crop.width,
          height: crop.height,
        }
      }],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );
    return result.uri;
  } catch (error) {
    console.error('Error cropping image:', error);
    throw new Error('Failed to crop image');
  }
}

// Rotate image
export async function rotateImage(
  uri: string,
  degrees: 90 | 180 | 270
): Promise<string> {
  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ rotate: degrees }],
      { compress: 1 }
    );
    return result.uri;
  } catch (error) {
    console.error('Error rotating image:', error);
    throw new Error('Failed to rotate image');
  }
}

// Upload file to Supabase storage
export async function uploadFileToSupabaseStorage(
  uri: string,
  remotePath: string,
  bucket: string,
  contentType: string = 'image/jpeg'
): Promise<{ publicUrl: string; path: string }> {
  try {
    // First, convert the uri to a blob
    const response = await fetch(uri);
    const blob = await response.blob();

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(remotePath, blob, {
        contentType,
        upsert: true,
      });

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      publicUrl: publicUrl.publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file to storage');
  }
}

// Get dimensions of an image
export async function getImageDimensions(uri: string): Promise<ImageDimensions> {
  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [],
      { compress: 1 }
    );
    return {
      width: result.width,
      height: result.height
    };
  } catch (error) {
    console.error('Error getting image dimensions:', error);
    throw new Error('Failed to get image dimensions');
  }
}

// Check if uri points to a valid image
export async function isValidImageUri(uri: string): Promise<boolean> {
  try {
    await ImageManipulator.manipulateAsync(uri, [], {});
    return true;
  } catch {
    return false;
  }
}

// Generate a unique filename for storage
export function generateUniqueFileName(originalName: string): string {
  const timestamp = new Date().getTime();
  const random = Math.random().toString(36).substring(7);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${random}.${extension}`;
}
