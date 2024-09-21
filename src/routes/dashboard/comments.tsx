import { createFileRoute } from '@tanstack/react-router';
import { AddUserComment } from '../../components/dashboard/forms/AddUserComment';
import { Box } from '@mui/material';
import { UserCommentTable } from '../../components/dashboard/tables/UserCommentTable';
import { useEffect, useState } from 'react';
import { Comments, Post, User } from '../../../types';

export const Route = createFileRoute('/dashboard/comments')({
  component: function CommentsRoute() {
    const [comments, setComments] = useState<Comments[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [selectedComment, setSelectedComment] =
      useState<Comments | null>(null);

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

      const getComments = async () => {
        try {
          const response = await fetch(
            'http://localhost:3001/api/comments'
          );
          const data = await response.json();
          setComments(data);
        } catch (error) {
          console.error('Failed to fetch comments', error);
        }
      };

      getUsers();
      getPosts();
      getComments();
    }, []);

    const deleteComment = async (id: number) => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/comments/${id}`,
          {
            method: 'DELETE',
          }
        );

        if (response.ok) {
          setComments((prevComment) =>
            prevComment.filter((comment) => comment.id !== id)
          );
        } else {
          alert('Error deleting comment');
        }
      } catch (error) {
        console.error('Failed to delete comment', error);
      }
    };

    // Handle Edit
    const editUserComment = (comment: Comments) => {
      setSelectedComment(comment);
      setIsEditing(true);
    };

    return (
      <Box>
        <AddUserComment
          users={users}
          posts={posts}
          setComments={setComments}
          isEditing={isEditing}
          selectedComment={selectedComment}
          setIsEditing={setIsEditing}
          setSelectedComment={setSelectedComment}
        />
        <UserCommentTable
          UserComments={comments}
          users={users}
          posts={posts}
          deleteUserComment={deleteComment}
          editUserComment={editUserComment}
        />
      </Box>
    );
  },
});
