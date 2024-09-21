import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
} from '@mui/material';
import { useEffect, useState, FormEvent } from 'react';
import { AddUserPostProps } from '../../../../types';
import { responsiveDesign } from '../../theme/Theme';

export const AddUserPost: React.FC<AddUserPostProps> = ({
  users,
  setPosts,
  isEditing,
  selectedPost,
  setIsEditing,
  setSelectedPost,
}) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    if (selectedPost) {
      setUserId(selectedPost.user_id);
      setTitle(selectedPost.title);
      setContent(selectedPost.content);
    } else {
      setUserId(null);
      setTitle('');
      setContent('');
    }
  }, [selectedPost]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (userId === null) {
      alert('Please select a user.');
      return;
    }

    const newPost = {
      user_id: userId,
      title,
      content,
    };

    try {
      let response;
      if (isEditing && selectedPost) {
        // Update existing profile
        response = await fetch(
          `http://localhost:3001/api/posts/${selectedPost.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPost),
          }
        );
      } else {
        // Create new profile
        response = await fetch('http://localhost:3001/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPost),
        });
      }

      if (response.ok) {
        if (isEditing && selectedPost) {
          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post.id === selectedPost.id
                ? { ...post, ...newPost }
                : post
            )
          );
        } else {
          // Refetch user profiles to get the updated list
          const updatedPostResponse = await fetch(
            'http://localhost:3001/api/posts'
          );
          const updatedPost = await updatedPostResponse.json();
          setPosts(updatedPost);
        }

        // Reset form
        setUserId(null);
        setTitle('');
        setContent('');
        setIsEditing(false);
        setSelectedPost(null);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Failed to create or update profile', error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ ...responsiveDesign }}
    >
      <Typography variant="h5">Create Post</Typography>
      <FormControl sx={{ m: 1, width: '300px' }}>
        <InputLabel id="user-select-label">Select Author</InputLabel>
        <Select
          labelId="user-select-label"
          value={userId ?? ''}
          onChange={(e) => setUserId(Number(e.target.value))}
          label="Select Author"
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

      <TextField
        label="Title"
        multiline
        rows={4}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        sx={{ m: 1, width: '300px' }}
      />
      <TextField
        label="Content"
        multiline
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        sx={{ m: 1, width: '300px' }}
      />

      <Button
        variant="contained"
        color="primary"
        type="submit"
        sx={{ m: 2 }}
      >
        {isEditing ? 'Update Post' : 'Create Post'}
      </Button>

      {isEditing && (
        <Button
          variant="outlined"
          onClick={() => {
            setIsEditing(false);
            setSelectedPost(null);
          }}
          sx={{ m: 2 }}
        >
          Cancel
        </Button>
      )}
    </Box>
  );
};
