import { Box } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { AddUserPost } from '../../components/dashboard/forms/AddUserPost';
import { UserPostTable } from '../../components/dashboard/tables/UserPostTable';
import { Post, User } from '../../../types';

// create a new post

export const Route = createFileRoute('/dashboard/posts')({
  component: function PostsRoute() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(
      null
    );

    // Fetch the user posts on mount
    useEffect(() => {
      const getPosts = async () => {
        try {
          const response = await fetch(
            'http://localhost:3001/api/posts'
          );
          const data = await response.json();
          setPosts(data);
        } catch (error) {
          console.error('Failed to fetch posts', error);
        }
      };

      const getUsers = async () => {
        try {
          const response = await fetch(
            'http://localhost:3001/api/users'
          );
          const data = await response.json();
          setUsers(data);
        } catch (error) {
          console.error('Failed to fetch users', error);
        }
      };

      getPosts();
      getUsers();
    }, []);

    const deletePost = async (id: number) => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/posts/${id}`,
          {
            method: 'DELETE',
          }
        );

        if (response.ok) {
          setPosts((prevPosts) =>
            prevPosts.filter((post) => post.id !== id)
          );
        } else {
          alert('Error deleting profile');
        }
      } catch (error) {
        console.error('Failed to delete user profile', error);
      }
    };

    // Handle Edit
    const editUserPost = (profile: Post) => {
      setSelectedPost(profile);
      setIsEditing(true);
    };

    return (
      <Box>
        <AddUserPost
          users={users}
          setPosts={setPosts}
          isEditing={isEditing}
          selectedPost={selectedPost}
          setIsEditing={setIsEditing}
          setSelectedPost={setSelectedPost}
        />
        <UserPostTable
          UserPosts={posts}
          users={users}
          deleteUserPost={deletePost}
          editUserPost={editUserPost}
        />
      </Box>
    );
  },
});
