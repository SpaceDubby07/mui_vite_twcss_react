import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useEffect, useState, FormEvent } from 'react';

interface User {
  id: number;
  name: string;
}

interface UserProfile {
  id: number;
  image: string;
  user_id: number;
  bio: string;
  date_of_birth: string;
  location: string;
}

interface AddUserProfileProps {
  users: User[];
  setUserProfiles: React.Dispatch<
    React.SetStateAction<UserProfile[]>
  >;
  isEditing: boolean;
  selectedProfile: UserProfile | null;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedProfile: React.Dispatch<
    React.SetStateAction<UserProfile | null>
  >;
}

export const AddUserProfile: React.FC<AddUserProfileProps> = ({
  users,
  setUserProfiles,
  isEditing,
  selectedProfile,
  setIsEditing,
  setSelectedProfile,
}) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [image, setImage] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [location, setLocation] = useState<string>('');

  useEffect(() => {
    if (selectedProfile) {
      setUserId(selectedProfile.user_id);
      setImage(selectedProfile.image);
      setBio(selectedProfile.bio);
      setDateOfBirth(selectedProfile.date_of_birth);
      setLocation(selectedProfile.location);
    } else {
      setUserId(null);
      setImage('');
      setBio('');
      setDateOfBirth('');
      setLocation('');
    }
  }, [selectedProfile]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (userId === null) {
      alert('Please select a user.');
      return;
    }

    const newProfile = {
      user_id: userId,
      image,
      bio,
      date_of_birth: dateOfBirth,
      location,
    };

    try {
      let response;
      if (isEditing && selectedProfile) {
        // Update existing profile
        response = await fetch(
          `http://localhost:3001/api/user_profiles/${selectedProfile.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProfile),
          }
        );
      } else {
        // Create new profile
        response = await fetch(
          'http://localhost:3001/api/user_profiles',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProfile),
          }
        );
      }

      if (response.ok) {
        if (isEditing && selectedProfile) {
          setUserProfiles((prevProfiles) =>
            prevProfiles.map((profile) =>
              profile.id === selectedProfile.id
                ? { ...profile, ...newProfile }
                : profile
            )
          );
        } else {
          // Refetch user profiles to get the updated list
          const updatedProfilesResponse = await fetch(
            'http://localhost:3001/api/user_profiles'
          );
          const updatedProfiles =
            await updatedProfilesResponse.json();
          setUserProfiles(updatedProfiles);
        }

        // Reset form
        setUserId(null);
        setImage('');
        setBio('');
        setDateOfBirth('');
        setLocation('');
        setIsEditing(false);
        setSelectedProfile(null);
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
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <FormControl sx={{ m: 1, width: '300px' }}>
        <InputLabel id="user-select-label">Select User</InputLabel>
        <Select
          labelId="user-select-label"
          value={userId ?? ''}
          onChange={(e) => setUserId(Number(e.target.value))}
          label="Select User"
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
        label="Image URL"
        multiline
        rows={4}
        value={image}
        onChange={(e) => setImage(e.target.value)}
        required
        sx={{ m: 1, width: '300px' }}
      />
      <TextField
        label="Bio"
        multiline
        rows={4}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        required
        sx={{ m: 1, width: '300px' }}
      />

      <TextField
        label="Date of Birth"
        type="date"
        value={dateOfBirth}
        onChange={(e) => setDateOfBirth(e.target.value)}
        InputLabelProps={{ shrink: true }}
        required
        sx={{ m: 1, width: '300px' }}
      />

      <TextField
        label="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
        sx={{ m: 1, width: '300px' }}
      />

      <Button
        variant="contained"
        color="primary"
        type="submit"
        sx={{ m: 2 }}
      >
        {isEditing ? 'Update Profile' : 'Create Profile'}
      </Button>

      {isEditing && (
        <Button
          variant="outlined"
          onClick={() => {
            setIsEditing(false);
            setSelectedProfile(null);
          }}
          sx={{ m: 2 }}
        >
          Cancel
        </Button>
      )}
    </Box>
  );
};
