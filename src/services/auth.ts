import axios from 'axios';
import { SignupPayload } from '../common/interfaces';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8222',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (credentials: {
  username: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post('/v1/api/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signup = async (payload: SignupPayload) => {
  try {
    const response = await apiClient.post(
      '/v1/api/auth/donor/sign-up',
      payload,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
