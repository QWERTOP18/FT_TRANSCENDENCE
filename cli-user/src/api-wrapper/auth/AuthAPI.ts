import axios from "axios";
import { AuthenticateRequest, AuthErrorSchema as AuthErrorSchema, SignupRequest, User } from "./auth";
import { config } from "../../config/config";
import { AuthError } from "./AuthError";

export class AuthAPI {
  async signup(name: string): Promise<User> {
    const requestBody: SignupRequest = { name };
    return await this.sendAPIRequest<User>('auth/signup', requestBody, 'POST');
  }

  async authenticate(name: string): Promise<User> {
    const requestBody: AuthenticateRequest = { name };
    return await this.sendAPIRequest<User>('auth/authenticate', requestBody, 'POST');
  }

  async sendAPIRequest<T>(endpoint: string, body?: any, method: 'GET' | 'POST' = 'GET'): Promise<T> {
    const url = `${config.gatewayURL}/${endpoint}`;
    return await axios({
      url,
      method,
      data: body,
      httpsAgent: new (require('https').Agent)({
        rejectUnauthorized: false
      })
    }).then((response) => {
      return response.data as T;
    }).catch((error) => {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data as AuthErrorSchema;
        if (errorData) {
          throw new AuthError(errorData, url);
        }
      }
      throw error;
    });
  }
} 
