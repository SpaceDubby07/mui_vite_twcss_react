import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { User } from '../../../../types';
import {
  useLogout,
  useUser,
  useUserVerification,
  verifyToken,
} from '../../../utils/functions';

function Comp() {
  const { userId } = useUser();
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
    return (
      <div className="mt-40 flex justify-center items-center mx-auto">
        <CircularProgress />
      </div>
    );
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

export const Route = createFileRoute('/home/$userId/')({
  component: () => <Comp />,
});
