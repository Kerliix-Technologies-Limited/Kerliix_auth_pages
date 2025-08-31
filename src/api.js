import axios from 'axios';

const API = axios.create({
  baseURL: 'https://api.kerliix.com/api',
  withCredentials: true,
});

export default API;
