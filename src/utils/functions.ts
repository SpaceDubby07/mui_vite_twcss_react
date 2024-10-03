import { useNavigate } from '@tanstack/react-router';
import Cookies from 'js-cookie';
import { useContext, useEffect } from 'react';
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

  useEffect(() => {
    const checkUserRoute = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const tokenUserId = await verifyToken();

          // Check if the token user ID matches the route user ID
          if (tokenUserId !== Number(userId)) {
            navigate({ to: `/home/${tokenUserId}` });
            return; // Stop further execution if redirecting
          }
        } catch (error) {
          console.error('Failed to verify token', error);
          navigate({ to: '/login' });
          return; // Stop further execution if redirecting
        }
      } else {
        // Redirect to login if no token is found
        navigate({ to: '/login' });
        return; // Stop further execution if redirecting
      }
    };

    checkUserRoute(); // Call the function to perform checks
  }, [userId, navigate]);
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
