export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface AuthUserResponse {
  name: string;
  email: string;
  token: string;
  expiresIn: number;
}

export interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}
