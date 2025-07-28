import axios from 'axios';
import { config } from '../config/config';
import { User, SignupRequest, AuthenticateRequest, AuthError } from '../types/auth';

export class AuthService {
  async signup(name: string): Promise<User> {
    try {
      console.log('Creating user account...');
      const requestBody: SignupRequest = { name };
      
      const response = await axios.post<User>(
        `${config.gatewayURL}auth/signup`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('User account created successfully!');
      return response.data;
    } catch (error) {
      console.error('Failed to create user account:', error);
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data as AuthError;
        if (errorData) {
          throw new Error(`Signup failed: ${errorData.message}`);
        }
      }
      throw error;
    }
  }

  async authenticate(name: string): Promise<User> {
    try {
      console.log('Authenticating user...');
      const requestBody: AuthenticateRequest = { name };
      
      const response = await axios.post<User>(
        `${config.gatewayURL}auth/authenticate`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('User authenticated successfully!');
      return response.data;
    } catch (error) {
    //   console.error('Failed to authenticate user:', error);
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data as AuthError;
        if (errorData) {
          throw new Error(`Authentication failed: ${errorData.message}`);
        }
      }
      throw error;
    }
  }
} 
