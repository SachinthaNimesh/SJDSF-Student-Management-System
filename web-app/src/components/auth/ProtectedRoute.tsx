import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { isLocalAuth, MOCK_LOCAL_USER, storeUserInfo } from '../../utils/authUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      if (isLocalAuth()) {
        // Auto-authenticate with mock user in local mode
        storeUserInfo(MOCK_LOCAL_USER);
        setUser(MOCK_LOCAL_USER);
      } else {
        // Redirect to Azure AD login in cloud/Choreo mode
        window.location.href = '/auth/login';
      }
    }
  }, [user, loading, navigate, setUser]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated and not in local mode, don't render children
  if (!user && !isLocalAuth()) {
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;
