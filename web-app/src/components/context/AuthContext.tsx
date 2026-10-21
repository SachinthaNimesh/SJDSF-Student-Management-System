// AuthContext.tsx - Coordinates authentication state supporting both local and Azure/Choreo auth
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getUserInfo,
  logout as authUtilsLogout,
  UserInfo,
  isLocalAuth,
  MOCK_LOCAL_USER,
} from "../../utils/authUtils";

export type { UserInfo };

interface AuthContextType {
  user: UserInfo | null;
  loading: boolean;
  setUser: (user: UserInfo | null) => void;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to refresh user info from any available source
  const refreshUser = async () => {
    setLoading(true);
    try {
      const userInfo = await getUserInfo();
      setUser(userInfo);
    } catch (error) {
      console.error("Error fetching user info:", error);
      if (isLocalAuth()) {
        setUser(MOCK_LOCAL_USER);
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to handle logout
  const logout = () => {
    setUser(null);
    authUtilsLogout();
  };

  // Initialize user info on mount
  useEffect(() => {
    refreshUser();
  }, []);

  const value = {
    user,
    loading,
    setUser,
    refreshUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
