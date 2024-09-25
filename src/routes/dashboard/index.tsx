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
  const [profileCount, setProfileCount] = useState<number>(0);
  const [postCount, setPostCount] = useState<number>(0);
  const [commentCount, setCommentCount] = useState<number>(0);
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

    const getProfiles = async () => {
      try {
        const response = await fetch(
          'http://localhost:3001/api/user_profiles'
        );
        const data = await response.json();
        setProfileCount(data.length);
      } catch (error) {
        console.error('Failed to fetch profiles', error);
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

    const getComments = async () => {
      try {
        const response = await fetch(
          'http://localhost:3001/api/comments'
        );
        const data = await response.json();
        setCommentCount(data.length);
      } catch (error) {
        console.error('Failed to fetch comments', error);
      }
    };

    getComments();
    getPosts();
    getUsers();
    getProfiles();
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
              Completed Profiles
            </Typography>

            <Gauge width={100} height={100} value={profileCount} />
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
              Total Posts
            </Typography>

            <Gauge width={100} height={100} value={postCount} />
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
              Total Comments
            </Typography>

            <Gauge width={100} height={100} value={commentCount} />
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
