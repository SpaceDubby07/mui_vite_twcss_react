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

const Cards = () => {
  const [userCount, setUserCount] = useState<number>(0);
  const [postCount, setPostCount] = useState<number>(0);
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

    const getPosts = async () => {
      try {
        const response = await fetch(
          'http://localhost:3001/api/posts'
        );
        const data = await response.json();
        setPostCount(data.length);
      } catch (error) {
        console.error('Failed to fetch posts', error);
      }
    };

    getPosts();
    getUsers();
  }, []);

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
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

            <Gauge width={100} height={100} value={postCount} />
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export const Route = createFileRoute('/dashboard/')({
  component: function DashboardRoute() {
    return <Cards />;
  },
});
