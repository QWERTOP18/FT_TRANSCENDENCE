import axios from "axios";
import { AuthenticateRequest, AuthErrorSchema as AuthErrorSchema, SignupRequest, User } from "./auth";
import { config } from "../../config/config";
import { AuthError } from "./AuthError";

export class AuthService {
  async signup(name: string): Promise<User> {
    const requestBody: SignupRequest = { name };
    return await axios.post<User>(
      `${config.gatewayURL}auth/signup`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).then((response) => {
      return response.data;
    })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          const errorData = error.response?.data as AuthErrorSchema;
          if (errorData) {
            throw new AuthError(errorData, `${config.gatewayURL}auth/signup`);
          }
        }
        throw error;
      });
  }

  async authenticate(name: string): Promise<User> {
    const requestBody: AuthenticateRequest = { name };
    return await axios.post<User>(
      `${config.gatewayURL}auth/authenticate`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).then((response) => {
      return response.data;
    }).catch((error) => {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data as AuthErrorSchema;
        if (errorData) {
          throw new AuthError(errorData, `${config.gatewayURL}auth/authenticate`);
        }
      }
      throw error;
    })
  }
} 
