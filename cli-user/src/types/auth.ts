export interface User {
  id: string;
  name: string;
}

export interface AuthError {
  code: string;
  statusCode: number;
  error: string;
  message: string;
}

export interface SignupRequest {
  name: string;
}

export interface AuthenticateRequest {
  name: string;
} 
