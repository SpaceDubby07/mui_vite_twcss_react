import {
  Avatar,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useUser } from '../../../utils/functions';
import { useEffect, useState } from 'react';
import { UserProfile } from '../../../../types';
const Profile = () => {
  const user = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(
    null
  );
  const [bio, setBio] = useState<string>(userProfile?.bio || '');

  console.log('user profile', userProfile);
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/user_profiles/user/${user?.userId}`
        );
        const data = await response.json();
        setUserProfile(data);
        setBio(data.bio);
      } catch (error) {
        console.error('Failed to fetch user profile', error);
      }
    };

    fetchUserProfile();
  }, [user]);

  const editBio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3001/api/user_profiles/${userProfile?.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...userProfile, bio }),
        }
      );
      const data = await response.json();
      setBio(data.bio);
    } catch (error) {
      console.error('Failed to edit bio', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h5" sx={{ mb: 4 }}>
        Profile
      </Typography>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
          <Avatar
            src={userProfile?.image}
            alt="profile image"
            sx={{ height: 96, width: 96 }}
          />
          <Box sx={{ ml: 2 }}>
            <Typography variant="h5">{user?.userName}</Typography>
            <Typography variant="h6">
              {userProfile?.date_of_birth
                ? Math.floor(
                    (new Date().getTime() -
                      new Date(userProfile.date_of_birth).getTime()) /
                      (1000 * 60 * 60 * 24 * 365.25)
                  ).toString()
                : ''}
            </Typography>
            <Typography variant="body1">
              {userProfile?.location}
            </Typography>
          </Box>
        </Box>
        <Typography variant="h5">Bio</Typography>

        <Box
          component="form"
          onSubmit={editBio}
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
          <TextField
            label={bio ? '' : 'Edit Bio'}
            multiline
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            sx={{ m: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ m: 2 }}
          >
            Edit Bio
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export const Route = createFileRoute('/home/$userId/profile')({
  component: () => (
    <Box>
      <Profile />
    </Box>
  ),
});
