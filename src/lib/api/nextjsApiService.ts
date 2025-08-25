import Constants from 'expo-constants';
import { AIPanelParams, APIResponse } from '../types';

const nextJsApiBaseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_NEXTJS_API_BASE_URL;

class NextJsApiService {
  private async apiCall<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any,
    accessToken?: string
  ): Promise<APIResponse<T>> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch(`${nextJsApiBaseUrl}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred');
      }

      return { data };
    } catch (error: any) {
      console.error('API call error:', error);
      return {
        error: {
          message: error.message || 'Failed to complete request',
          code: error.status || 500,
        },
      };
    }
  }

  // AI-related endpoints
  async sendToAIEditEndpoint(
    imageBase64: string,
    prompt: string,
    accessToken: string,
    maskBase64?: string,
    options?: AIPanelParams
  ): Promise<APIResponse<{ transformedImageBase64: string }>> {
    return this.apiCall('/api/gemini/image-edit', 'POST', {
      imageBase64,
      prompt,
      maskBase64,
      ...options,
    }, accessToken);
  }

  async sendToAIGenerateEndpoint(
    prompt: string,
    accessToken: string,
    options?: AIPanelParams
  ): Promise<APIResponse<{ generatedImageBase64: string }>> {
    return this.apiCall('/api/gemini/image-generate', 'POST', {
      prompt,
      ...options,
    }, accessToken);
  }

  // Push Notifications
  async registerPushToken(
    userId: string,
    token: string,
    accessToken: string
  ): Promise<APIResponse<null>> {
    return this.apiCall('/api/notifications/register-token', 'POST', {
      userId,
      token,
    }, accessToken);
  }

  // Stripe Integration
  async initiateStripeCheckout(
    products: { productId: string; quantity: number }[],
    userId: string,
    accessToken: string
  ): Promise<APIResponse<{ checkoutUrl: string }>> {
    return this.apiCall('/api/stripe/create-checkout-session', 'POST', {
      products,
      userId,
    }, accessToken);
  }

  // File Downloads
  async getDownloadLink(
    transactionId: string,
    userId: string,
    accessToken: string
  ): Promise<APIResponse<{ downloadUrl: string }>> {
    return this.apiCall(
      '/api/marketplace/generate-download-link',
      'POST',
      { transactionId, userId },
      accessToken
    );
  }
}

export const nextJsApiService = new NextJsApiService();
