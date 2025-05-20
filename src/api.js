import axios from 'axios';

// Always use the full Railway backend URL
const API_BASE = process.env.REACT_APP_BACKEND_URL || 'https://auction-website-server-production.up.railway.app';


export const api = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});
