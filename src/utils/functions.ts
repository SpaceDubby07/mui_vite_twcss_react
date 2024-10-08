import { useNavigate } from '@tanstack/react-router';
import Cookies from 'js-cookie';
import { useCallback, useContext, useEffect } from 'react';
import { UserContext } from '../providers/UserContext';

// verify a users token, if it exists, add return their user id
export const verifyToken = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/token', {
      method: 'GET', // Make this a GET request
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Ensure cookies are sent with the request
    });

    if (!response.ok) {
      throw new Error('Token verification failed');
    }

    const data = await response.json();
    return data.id; // Return the user ID
  } catch (error) {
    console.error('Failed to verify token', error);
  }
};

// check if the user is the current logged in user
export const useUserVerification = (userId: number) => {
  const navigate = useNavigate();
  // Memoize token verification to avoid re-creating the function on every render
  const verifyUser = useCallback(async () => {
    const token = Cookies.get('token');

    if (!token) {
      // No token found, redirect to login
      navigate({ to: '/login' });
      return;
    }

    try {
      const tokenUserId = await verifyToken();

      if (tokenUserId !== userId) {
        // If user IDs don't match, redirect to the correct user's home
        navigate({ to: `/home/${tokenUserId}` });
      }
    } catch (error) {
      console.error('Failed to verify token', error);
      // In case of any error, redirect to login
      navigate({ to: '/login' });
    }
  }, [userId, navigate]);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]); // Add verifyUser to the dependency array
};

// logout the user
export const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    Cookies.remove('token');
    navigate({ to: '/login' });
  };

  return logout;
};

// Hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
