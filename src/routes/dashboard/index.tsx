import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';
import { Gauge } from '@mui/x-charts';
import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';

const UserCount = ({ userCount }: { userCount: number }) => {
  return (
    <>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4">Welcome Admin!</Typography>
      </Box>
      <Stack direction={'row'}>
        <Card>
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              sx={{ color: 'text.secondary' }}
            >
              Total Users
            </Typography>

            <Gauge width={100} height={100} value={userCount} />
          </CardContent>
        </Card>
      </Stack>
    </>
  );
};

export const Route = createFileRoute('/dashboard/')({
  component: function DashboardRoute() {
    const [userCount, setUserCount] = useState<number>(0);

    useEffect(() => {
      const getUsers = async () => {
        try {
          const response = await fetch(
            'http://localhost:3001/api/users'
          );
          const data = await response.json();
          setUserCount(data.length);
        } catch (error) {
          console.error('Failed to fetch users', error);
        }
      };
      getUsers();
    }, []);

    return (
      <Box>
        <UserCount userCount={userCount} />
      </Box>
    );
  },
});
