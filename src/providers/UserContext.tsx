import React, { createContext, useState, useEffect } from 'react';
import { verifyToken } from '../utils/functions';

// Define the shape of the user context
interface UserContextType {
  userId: number | null;
  userName: string;
  userEmail: string;
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
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserFromToken = async () => {
      const id = await verifyToken();
      setUserId(id);
      setLoading(false);
    };

    const fetchUser = async () => {
      const response = await fetch(
        `http://localhost:3001/api/users/${userId}`
      );
      const data = await response.json();
      setUserName(data.name);
      setUserEmail(data.email);
      setLoading(false);
    };
    if (userId) {
      fetchUser();
    }
    getUserFromToken();
  }, [userId]);

  return (
    <UserContext.Provider
      value={{ userId, userName, userEmail, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
