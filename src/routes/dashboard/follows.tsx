import { Box } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { AddFollow } from '../../components/dashboard/forms/AddFollow';
import { useEffect, useState } from 'react';
import { Follow, User } from '../../../types';
import { FollowsTable } from '../../components/dashboard/tables/FollowsTable';

export const Route = createFileRoute('/dashboard/follows')({
  component: function FollowsRoute() {
    const [users, setUsers] = useState<User[]>([]);
    const [follows, setFollows] = useState<Follow[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [selectedFollow, setSelectedFollow] =
      useState<Follow | null>(null);

    useEffect(() => {
      // get follows
      const getFollows = async () => {
        try {
          const response = await fetch(
            'http://localhost:3001/api/follows'
          );
          const data = await response.json();
          setFollows(data);
        } catch (error) {
          console.error('Failed to fetch follows', error);
        }
      };
      // get users
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

      getFollows();
      getUsers();
    }, []);

    const deleteFollow = async (id: number) => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/follows/${id}`,
          {
            method: 'DELETE',
          }
        );

        if (response.ok) {
          setFollows((prevFollow) =>
            prevFollow.filter((follow) => follow.id !== id)
          );
        } else {
          alert('Error deleting follow');
        }
      } catch (error) {
        console.error('Failed to delete follow', error);
      }
    };

    // Handle Edit
    const editFollow = (follow: Follow) => {
      setSelectedFollow(follow);
      setIsEditing(true);
    };

    return (
      <Box>
        <AddFollow
          users={users}
          setFollows={setFollows}
          isEditing={isEditing}
          selectedFollow={selectedFollow}
          setIsEditing={setIsEditing}
          setSelectedFollow={setSelectedFollow}
        />
        <FollowsTable
          users={users}
          follows={follows}
          deleteFollow={deleteFollow}
          editFollow={editFollow}
        />
      </Box>
    );
  },
});
