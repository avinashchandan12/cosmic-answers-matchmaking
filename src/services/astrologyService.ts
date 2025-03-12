
import { endpoints, PROKERALA_CLIENT_ID, PROKERALA_CLIENT_SECRET } from '@/config/api';

interface ChartParams {
  datetime: string;
  latitude: number;
  longitude: number;
  ayanamsa: string;
}

export const getAccessToken = async () => {
  try {
    const response = await fetch('https://api.prokerala.com/v2/token', {
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

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};

export const getBirthChart = async (params: ChartParams) => {
  try {
    const token = await getAccessToken();
    const response = await fetch(endpoints.birthChart, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    return await response.json();
  } catch (error) {
    console.error('Error fetching birth chart:', error);
    throw error;
  }
};

export const getMatchmaking = async (boy: ChartParams, girl: ChartParams) => {
  try {
    const token = await getAccessToken();
    const response = await fetch(endpoints.matchmaking, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        boy_birth_details: boy,
        girl_birth_details: girl,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error fetching matchmaking details:', error);
    throw error;
  }
};
