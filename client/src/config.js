export const backendUrl = !(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 'http://localhost:4000' : 'https://nba-stats-app-backend.onrender.com';
