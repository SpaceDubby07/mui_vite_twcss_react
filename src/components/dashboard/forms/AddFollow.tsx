import React, { useState, useEffect, FormEvent } from 'react';
import { AddFollowsProps } from '../../../../types';
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Typography,
} from '@mui/material';
import { responsiveDesign } from '../../theme/Theme';

export const AddFollow: React.FC<AddFollowsProps> = ({
  users,
  setFollows,
  isEditing,
  selectedFollow,
  setIsEditing,
  setSelectedFollow,
}) => {
  const [follower_id, setFollower_id] = useState<number | null>(null);
  const [followed_id, setFollowed_id] = useState<number | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error'
  >('success');

  useEffect(() => {
    if (selectedFollow) {
      setFollower_id(selectedFollow.follower_id);
      setFollowed_id(selectedFollow.followed_id);
    } else {
      setFollower_id(null);
      setFollowed_id(null);
    }
  }, [selectedFollow]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (follower_id === null) {
      alert('Please select a follower.');
      return;
    }

    if (followed_id === null) {
      alert('Please select a followed.');
      return;
    }

    const newFollow = {
      follower_id,
      followed_id,
    };

    try {
      let response;
      if (isEditing && selectedFollow) {
        // Update existing follow
        response = await fetch(
          `http://localhost:3001/api/follows/${selectedFollow.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newFollow),
          }
        );
      } else {
        // Create new follow
        response = await fetch('http://localhost:3001/api/follows', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newFollow),
        });
      }

      if (response.ok) {
        if (isEditing && selectedFollow) {
          setFollows((prevState) =>
            prevState.map((follow) =>
              follow.id === selectedFollow.id
                ? { ...follow, ...newFollow }
                : follow
            )
          );
        } else {
          // refetch follows to get the updated list
          const updatedFollowResponse = await fetch(
            'http://localhost:3001/api/follows'
          );
          const updatedFollow = await updatedFollowResponse.json();
          setFollows(updatedFollow);
        }

        // check for a match
        const matchResponse = await fetch(
          `http://localhost:3001/api/follows/check/${follower_id}/${followed_id}`
        );

        if (matchResponse.ok) {
          const match = await matchResponse.json();
          if (match) {
            const follower = users.find(
              (user) => user.id === follower_id
            );
            const followed = users.find(
              (user) => user.id === followed_id
            );
            setSnackbarMessage(
              `Match found between ${follower?.name} (id: ${follower?.id}) and ${followed?.name} (id: ${followed?.id})`
            );
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
          } else {
            const follower = users.find(
              (user) => user.id === follower_id
            );
            const followed = users.find(
              (user) => user.id === followed_id
            );
            setSnackbarMessage(
              `No match found between ${follower?.name} (id: ${follower?.id}) and ${followed?.name} (id: ${followed?.id})`
            );
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
          }
        }

        // reset form
        setFollower_id(null);
        setFollowed_id(null);
        setIsEditing(false);
        setSelectedFollow(null);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Failed to create or update follows', error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ ...responsiveDesign }}
    >
      <Typography variant="h5">Create Follow</Typography>
      <FormControl sx={{ m: 1 }}>
        <InputLabel id="user-select-label">
          Select follower ID
        </InputLabel>
        <Select
          labelId="user-select-label"
          value={follower_id ?? ''}
          onChange={(e) => setFollower_id(Number(e.target.value))}
          label="Select follower ID"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name} (ID: {user.id})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1 }}>
        <InputLabel id="post-select-label">
          Select User to Follow
        </InputLabel>
        <Select
          labelId="post-select-label"
          value={followed_id ?? ''}
          onChange={(e) => setFollowed_id(Number(e.target.value))}
          label="Select User to Follow"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name} (ID: {user.id})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        type="submit"
        sx={{ m: 2 }}
      >
        {isEditing ? 'Update Follow' : 'Add Follow'}
      </Button>

      {isEditing && (
        <Button
          variant="outlined"
          onClick={() => {
            setIsEditing(false);
            setSelectedFollow(null);
          }}
          sx={{ m: 2 }}
        >
          Cancel
        </Button>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
