import { createContext } from 'react';
import { User, RegisterData, LoginCredentials } from '../types';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}

// Kept in its own module (no component exports) so React Fast Refresh works
// correctly for both the provider component and the useAuth hook.
export const AuthContext = createContext<AuthContextType | null>(null);
