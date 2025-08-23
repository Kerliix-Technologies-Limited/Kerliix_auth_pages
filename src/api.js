import axios from 'axios';

const API = axios.create({
  baseURL: 'https://kerliix-auth-server-ojud.onrender.com/api',
  withCredentials: true,
});

export default API;

