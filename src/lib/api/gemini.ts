// src/lib/api/gemini.ts
import { siteConfig } from '../constants';
import { AAResponse } from '../types';

export async function callAIEditEndpoint(imageBase64: string, prompt: string, maskBase64?: string): Promise<AAResponse> {
  const res = await fetch(`${siteConfig.nextJsApiBaseUrl}/api/gemini/image-edit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, prompt, maskBase64 }),
  });
  return res.json();
}

export async function callAIGenerateEndpoint(prompt: string): Promise<AAResponse> {
  const res = await fetch(`${siteConfig.nextJsApiBaseUrl}/api/gemini/image-generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  return res.json();
}

export async function callAIAnalyzeEndpoint(imageBase64: string): Promise<{ tags: string[]; dominantColors: string[]; detectedObjects: string[]; }> {
  const res = await fetch(`${siteConfig.nextJsApiBaseUrl}/api/ai/analyze-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64 }),
  });
  return res.json();
}
