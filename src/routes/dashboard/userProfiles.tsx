import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { AddUserProfile } from '../../components/dashboard/forms/AddUserProfile';
import { UserProfileTable } from '../../components/dashboard/tables/UserProfileTable';
import { User, UserProfile } from '../../../types';

export const Route = createFileRoute('/dashboard/userProfiles')({
  component: function UserProfileRoute() {
    const [userProfiles, setUserProfiles] = useState<UserProfile[]>(
      []
    );
    const [users, setUsers] = useState<User[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [selectedProfile, setSelectedProfile] =
      useState<UserProfile | null>(null);

    // Fetch the user profiles on mount
    useEffect(() => {
      const getUserProfiles = async () => {
        try {
          const response = await fetch(
            'http://localhost:3001/api/user_profiles'
          );
          const data = await response.json();
          setUserProfiles(data);
        } catch (error) {
          console.error('Failed to fetch user profiles', error);
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

      getUserProfiles();
      getUsers();
    }, []);

    // Handle Delete
    const deleteUserProfile = async (id: number) => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/user_profiles/${id}`,
          {
            method: 'DELETE',
          }
        );

        if (response.ok) {
          setUserProfiles((prevProfiles) =>
            prevProfiles.filter((profile) => profile.id !== id)
          );
        } else {
          alert('Error deleting profile');
        }
      } catch (error) {
        console.error('Failed to delete user profile', error);
      }
    };

    // Handle Edit
    const editUserProfile = (profile: UserProfile) => {
      setSelectedProfile(profile);
      setIsEditing(true);
    };

    return (
      <div>
        <AddUserProfile
          users={users}
          setUserProfiles={setUserProfiles}
          isEditing={isEditing}
          selectedProfile={selectedProfile}
          setIsEditing={setIsEditing}
          setSelectedProfile={setSelectedProfile}
        />
        <UserProfileTable
          users={users}
          userProfiles={userProfiles}
          deleteUserProfile={deleteUserProfile}
          editUserProfile={editUserProfile}
        />
      </div>
    );
  },
});
