import { useState } from 'react';

export interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async <T,>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      // Placeholder: Replace with actual API base URL later
      const baseUrl = '/api';
      const response = await fetch(`${baseUrl}${endpoint}`, options);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      setLoading(false);
      return data as T;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setLoading(false);
      
      // Return mock data for development
      return getMockData<T>(endpoint);
    }
  };

  return { fetchData, loading, error };
};

// Mock data generator for development
function getMockData<T>(endpoint: string): T | null {
  if (endpoint.includes('/misinfo/top')) {
    return {
      keywords: [
        { text: 'vaccine', score: 95, category: 'health' },
        { text: 'election', score: 88, category: 'politics' },
        { text: 'covid', score: 82, category: 'health' },
        { text: 'conspiracy', score: 75, category: 'general' },
        { text: 'climate', score: 70, category: 'politics' },
        { text: 'hoax', score: 65, category: 'general' },
        { text: 'fake', score: 60, category: 'general' },
        { text: 'cure', score: 58, category: 'health' },
        { text: 'scam', score: 55, category: 'general' },
        { text: 'miracle', score: 50, category: 'health' },
      ],
    } as T;
  }

  if (endpoint.includes('/misinfo/topic/')) {
    return {
      keyword: 'vaccine',
      spreadScore: 95,
      verdict: 'Misleading',
      explanation: 'Multiple false claims about vaccine safety have been spreading rapidly across social media platforms.',
      references: [
        { source: 'WHO', url: '#', title: 'Vaccine Safety Facts' },
        { source: 'CDC', url: '#', title: 'Immunization Information' },
      ],
      timeline: [
        { date: '2024-01-15', events: 120, description: 'Initial spike in shares' },
        { date: '2024-01-20', events: 350, description: 'Viral WhatsApp forward' },
        { date: '2024-01-25', events: 180, description: 'Fact-check published' },
      ],
    } as T;
  }

  if (endpoint.includes('/misinfo/check')) {
    return {
      verdict: 'False',
      confidence: 92,
      summary: 'This message contains false information that has been debunked by multiple fact-checking organizations.',
      sources: [
        { name: 'FactCheck.org', url: '#' },
        { name: 'Snopes', url: '#' },
      ],
      relatedKeywords: ['vaccine', 'hoax', 'conspiracy'],
    } as T;
  }

  if (endpoint.includes('/misinfo/heatmap')) {
    return {
      hotspots: [
        { lat: 28.6139, lng: 77.2090, intensity: 85, category: 'health', keywords: ['vaccine', 'cure'] },
        { lat: 19.0760, lng: 72.8777, intensity: 72, category: 'politics', keywords: ['election', 'conspiracy'] },
        { lat: 12.9716, lng: 77.5946, intensity: 68, category: 'general', keywords: ['scam', 'hoax'] },
        { lat: 22.5726, lng: 88.3639, intensity: 55, category: 'health', keywords: ['covid', 'miracle'] },
      ],
    } as T;
  }

  return null;
}
