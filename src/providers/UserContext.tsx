import React, { createContext, useState, useEffect } from 'react';
import { verifyToken } from '../utils/functions';

// Define the shape of the user context
interface UserContextType {
  userId: number | null;
  loading: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

// Create a provider component
const UserProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserFromToken = async () => {
      const id = await verifyToken();
      setUserId(id);
      setLoading(false);
    };
    getUserFromToken();
  }, []);

  return (
    <UserContext.Provider value={{ userId, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
