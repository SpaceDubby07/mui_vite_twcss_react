import { Box } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { User, UserImage } from '../../../types';
import { AddUserImage } from '../../components/dashboard/forms/AddUserImage';
import { UserImagesTable } from '../../components/dashboard/tables/UserImagesTable';

export const Route = createFileRoute('/dashboard/userImages')({
  component: function UserImagesRoute() {
    const [userImages, setUserImages] = useState<UserImage[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    console.log(userImages, users);

    // Fetch the user profiles on mount
    useEffect(() => {
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

      const getUserImages = async () => {
        try {
          const response = await fetch(
            'http://localhost:3001/api/uploads'
          );
          const data = await response.json();
          setUserImages(data);
        } catch (error) {
          console.error('Failed to fetch user images', error);
        }
      };

      getUserImages();
      getUsers();
    }, []);

    const deleteImage = async (id: number) => {
      const imageToDelete = userImages.find(
        (image) => image.id === id
      );

      if (!imageToDelete) {
        console.error('Image not found');
        return;
      }

      const { user_id, image } = imageToDelete;

      const payload = {
        user_id, // Send the user_id from the image record
        image, // Send the image URL from the image record
      };

      try {
        const response = await fetch(
          `http://localhost:3001/api/uploads/${id}`,
          {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload), // Include the user_id and image in the body
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          alert(`Error: ${errorData.error}`);
        } else {
          const updatedUserImages = userImages.filter(
            (image) => image.id !== id
          );
          setUserImages(updatedUserImages);
        }
      } catch (error) {
        console.error('Failed to delete user image', error);
      }
    };

    return (
      <Box>
        <AddUserImage users={users} setImages={setUserImages} />
        <UserImagesTable
          userImages={userImages}
          users={users}
          deleteUserImage={deleteImage}
        />
      </Box>
    );
  },
});
