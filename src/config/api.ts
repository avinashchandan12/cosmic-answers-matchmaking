
// WARNING: This is a temporary solution. In production, API keys should be stored securely in backend services
export const PROKERALA_CLIENT_ID = 'YOUR_CLIENT_ID';
export const PROKERALA_CLIENT_SECRET = 'YOUR_CLIENT_SECRET';

// Prokerala API endpoints
export const PROKERALA_BASE_URL = 'https://api.prokerala.com/v2';
export const endpoints = {
  transitChart: `${PROKERALA_BASE_URL}/astrology/chart`,
  birthChart: `${PROKERALA_BASE_URL}/astrology/birth-chart`,
  matchmaking: `${PROKERALA_BASE_URL}/astrology/matchmaking`,
};
