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
import { AddUserCommentProps } from '../../../../types';
import { responsiveDesign } from '../../theme/Theme';

// Implement responsive design for the MUI interface

export const AddUserComment: React.FC<AddUserCommentProps> = ({
  users,
  posts,
  setComments,
  isEditing,
  selectedComment,
  setIsEditing,
  setSelectedComment,
}) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [postId, setPostId] = useState<number | null>(null);
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    if (selectedComment) {
      setUserId(selectedComment.user_id);
      setPostId(selectedComment.post_id);
      setContent(selectedComment.content);
    } else {
      setUserId(null);
      setPostId(null);
      setContent('');
    }
  }, [selectedComment]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (userId === null) {
      alert('Please select a user.');
      return;
    }

    if (postId === null) {
      alert('Please select a post.');
      return;
    }

    const newComment = {
      user_id: userId,
      post_id: postId,
      content,
    };

    try {
      let response;
      if (isEditing && selectedComment) {
        // Update existing comment
        response = await fetch(
          `http://localhost:3001/api/comments/${selectedComment.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newComment),
          }
        );
      } else {
        // Create new comment
        response = await fetch('http://localhost:3001/api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newComment),
        });
      }

      if (response.ok) {
        if (isEditing && selectedComment) {
          setComments((prevComment) =>
            prevComment.map((comment) =>
              comment.id === selectedComment.id
                ? { ...comment, ...newComment }
                : comment
            )
          );
        } else {
          // Refetch user profiles to get the updated list
          const updatedCommentResponse = await fetch(
            'http://localhost:3001/api/comments'
          );
          const updatedComment = await updatedCommentResponse.json();
          setComments(updatedComment);
        }

        // Reset form
        setUserId(null);
        setPostId(null);
        setContent('');
        setIsEditing(false);
        setSelectedComment(null);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Failed to create or update comment', error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ ...responsiveDesign }}
    >
      <Typography variant="h5">Create Comment</Typography>
      <FormControl sx={{ m: 1 }}>
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
      <FormControl sx={{ m: 1 }}>
        <InputLabel id="post-select-label">Select Post</InputLabel>
        <Select
          labelId="post-select-label"
          value={postId ?? ''}
          onChange={(e) => setPostId(Number(e.target.value))}
          label="Select Post"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {posts.map((post) => (
            <MenuItem key={post.id} value={post.id}>
              {post.title} (ID: {post.id})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Content"
        multiline
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        sx={{ m: 1 }}
      />

      <Button
        variant="contained"
        color="primary"
        type="submit"
        sx={{ m: 2 }}
      >
        {isEditing ? 'Update Comment' : 'Add Comment'}
      </Button>

      {isEditing && (
        <Button
          variant="outlined"
          onClick={() => {
            setIsEditing(false);
            setSelectedComment(null);
          }}
          sx={{ m: 2 }}
        >
          Cancel
        </Button>
      )}
    </Box>
  );
};
