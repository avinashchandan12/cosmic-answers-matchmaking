
// WARNING: This is a temporary solution. In production, API keys should be stored securely in backend services
export const PROKERALA_CLIENT_ID = 'YOUR_CLIENT_ID';
export const PROKERALA_CLIENT_SECRET = 'YOUR_CLIENT_SECRET';

// Prokerala API endpoints
export const PROKERALA_BASE_URL = 'https://api.prokerala.com/v2';
export const endpoints = {
  transitChart: `${PROKERALA_BASE_URL}/astrology/chart`,
  birthChart: `${PROKERALA_BASE_URL}/astrology/birth-chart`,
  matchmaking: `${PROKERALA_BASE_URL}/astrology/matchmaking`,
  ashtakoot: `${PROKERALA_BASE_URL}/astrology/ashtakoot`,
  planets: `${PROKERALA_BASE_URL}/astrology/planets`,
  dasha: `${PROKERALA_BASE_URL}/astrology/dasha`,
  nakshatra: `${PROKERALA_BASE_URL}/astrology/nakshatra`,
  chartD1: `${PROKERALA_BASE_URL}/astrology/chart/d1`,
  chartD9: `${PROKERALA_BASE_URL}/astrology/chart/d9`,
};

// Google Maps API key - this should be moved to a secure environment in production
export const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';
