import { FormEvent, useEffect, useState } from 'react';
import { AddUserProps } from '../../../../types';
import { Box, Button, TextField, Typography } from '@mui/material';
import { responsiveDesign } from '../../theme/Theme';

export const AddUser: React.FC<AddUserProps> = ({
  setUsers,
  isEditing,
  selectedUser,
  setIsEditing,
  setSelectedUser,
}) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    if (selectedUser) {
      setName(selectedUser.name);
      setEmail(selectedUser.email);
    } else {
      setName('');
      setEmail('');
    }
  }, [selectedUser]);

  // This function will handle submitting a new user
  // or editing an existing user
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isEditing && selectedUser) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/users/${selectedUser.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email }),
          }
        );
        if (response.ok) {
          setUsers((prevState) =>
            prevState.map((user) =>
              user.id === selectedUser.id
                ? { ...user, name, email }
                : user
            )
          );
          setIsEditing(false);
          setSelectedUser(null);
          setName('');
          setEmail('');
        } else {
          alert('Error updating user');
        }
      } catch (error) {
        console.error('Failed to update user', error);
      }
    } else {
      try {
        const response = await fetch(
          'http://localhost:3001/api/users',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          alert(`User added with ID: ${data.id}`);
          setUsers((prevState) => [
            ...prevState,
            { id: data.id, name, email },
          ]);
          setName('');
          setEmail('');
        } else {
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        console.error('Failed to add user', error);
      }
    }
  };

  return (
    <Box
      component={'form'}
      onSubmit={handleSubmit}
      sx={{
        ...responsiveDesign,
      }}
    >
      <Typography variant="h5">Create User</Typography>

      <TextField
        label="Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        margin="normal"
        variant="outlined"
        sx={{
          width: { xs: '100%', lg: '40%' },
          m: { xs: 1, lg: 2 },
        }}
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        margin="normal"
        variant="outlined"
        sx={{
          width: { xs: '100%', lg: '40%' },
          m: { xs: 1, lg: 2 },
        }}
      />
      <Button sx={{ m: 2 }} variant="contained" type="submit">
        {isEditing ? 'Save' : 'Add User'}
      </Button>
      {isEditing && (
        <Button
          sx={{ m: 2 }}
          variant="outlined"
          onClick={() => {
            setIsEditing(false);
            setSelectedUser(null);
            setName('');
            setEmail('');
          }}
        >
          Cancel
        </Button>
      )}
    </Box>
  );
};
