
import { PROKERALA_BASE_URL, PROKERALA_CLIENT_ID, PROKERALA_CLIENT_SECRET, endpoints } from '@/config/api';
import { toast } from '@/hooks/use-toast';

// This would typically be done server-side to protect API credentials
let accessToken: string | null = null;
let tokenExpiry: number | null = null;

// Interfaces for birth data
export interface BirthData {
  datetime: string; // ISO format
  latitude: number;
  longitude: number;
  ayanamsa?: string; // Default to 'lahiri' if not specified
}

// Get access token for Prokerala API
const getAccessToken = async (): Promise<string> => {
  // Check if we have a valid token
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    // In a real application, this should be done server-side
    // This is a simplified version for demonstration
    const response = await fetch(`${PROKERALA_BASE_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: PROKERALA_CLIENT_ID,
        client_secret: PROKERALA_CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to obtain access token');
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in * 1000);
    return accessToken;
  } catch (error) {
    console.error('Error getting access token:', error);
    toast({
      title: 'API Error',
      description: 'Failed to authenticate with astrology service',
      variant: 'destructive',
    });
    throw error;
  }
};

// Get birth chart
export const getBirthChart = async (birthData: BirthData) => {
  try {
    const token = await getAccessToken();
    const response = await fetch(endpoints.birthChart, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`,
      },
      body: new URLSearchParams({
        datetime: birthData.datetime,
        latitude: birthData.latitude.toString(),
        longitude: birthData.longitude.toString(),
        ayanamsa: birthData.ayanamsa || 'lahiri',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch birth chart');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching birth chart:', error);
    toast({
      title: 'Chart Error',
      description: 'Failed to generate birth chart',
      variant: 'destructive',
    });
    throw error;
  }
};

// Get dasha
export const getDasha = async (birthData: BirthData) => {
  try {
    const token = await getAccessToken();
    const response = await fetch(endpoints.dasha, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`,
      },
      body: new URLSearchParams({
        datetime: birthData.datetime,
        latitude: birthData.latitude.toString(),
        longitude: birthData.longitude.toString(),
        ayanamsa: birthData.ayanamsa || 'lahiri',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dasha information');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching dasha:', error);
    toast({
      title: 'Dasha Error',
      description: 'Failed to generate dasha information',
      variant: 'destructive',
    });
    throw error;
  }
};

// Get nakshatra
export const getNakshatra = async (birthData: BirthData) => {
  try {
    const token = await getAccessToken();
    const response = await fetch(endpoints.nakshatra, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`,
      },
      body: new URLSearchParams({
        datetime: birthData.datetime,
        latitude: birthData.latitude.toString(),
        longitude: birthData.longitude.toString(),
        ayanamsa: birthData.ayanamsa || 'lahiri',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch nakshatra information');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching nakshatra:', error);
    toast({
      title: 'Nakshatra Error',
      description: 'Failed to generate nakshatra information',
      variant: 'destructive',
    });
    throw error;
  }
};

// Get chart by type (D1, D9, etc.)
export const getChartByType = async (birthData: BirthData, chartType: string) => {
  try {
    const token = await getAccessToken();
    const endpoint = `${PROKERALA_BASE_URL}/astrology/chart/${chartType.toLowerCase()}`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`,
      },
      body: new URLSearchParams({
        datetime: birthData.datetime,
        latitude: birthData.latitude.toString(),
        longitude: birthData.longitude.toString(),
        ayanamsa: birthData.ayanamsa || 'lahiri',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${chartType} chart`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${chartType} chart:`, error);
    toast({
      title: 'Chart Error',
      description: `Failed to generate ${chartType} chart`,
      variant: 'destructive',
    });
    throw error;
  }
};

// Get compatibility score (ashtakoot)
export const getCompatibility = async (
  person1: BirthData, 
  person2: BirthData
) => {
  try {
    const token = await getAccessToken();
    const response = await fetch(endpoints.ashtakoot, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`,
      },
      body: new URLSearchParams({
        girl_datetime: person1.datetime,
        girl_latitude: person1.latitude.toString(),
        girl_longitude: person1.longitude.toString(),
        boy_datetime: person2.datetime,
        boy_latitude: person2.latitude.toString(),
        boy_longitude: person2.longitude.toString(),
        ayanamsa: person1.ayanamsa || 'lahiri',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch compatibility score');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching compatibility:', error);
    toast({
      title: 'Compatibility Error',
      description: 'Failed to calculate compatibility score',
      variant: 'destructive',
    });
    throw error;
  }
};
