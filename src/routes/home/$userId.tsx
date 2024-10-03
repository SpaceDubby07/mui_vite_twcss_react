import { createFileRoute, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { User } from '../../../types';
import { Button } from '@mui/material';
import {
  useLogout,
  useUserVerification,
  verifyToken,
} from '../../utils/functions';

function Comp() {
  const { userId } = useParams({ from: `/home/$userId` });
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true); // Add a loading state
  const logout = useLogout();

  // Call the user verification hook
  useUserVerification(Number(userId));

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(
        `http://localhost:3001/api/users/${userId}`
      );
      const data = await response.json();
      setUser(data);
      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  // If loading, show a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // If no user is found, take the user to the login screen or show an error message
  if (!user) {
    return <div>No user found</div>; // Or redirect to the login page
  }

  return (
    <div>
      <div>{user?.id}</div>
      <div>{user?.name}</div>
      <div>{user?.email} </div>
      <Button onClick={verifyToken}>Test token verification</Button>
      <Button onClick={logout}>Log Out</Button>
    </div>
  );
}

export const Route = createFileRoute('/home/$userId')({
  // get user id from route params
  component: () => <Comp />,
});
