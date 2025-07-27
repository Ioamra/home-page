export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  photo: File | null;
}

export interface AuthResponse {
  message: string;
}
