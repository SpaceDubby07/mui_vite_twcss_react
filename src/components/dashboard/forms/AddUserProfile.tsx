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
import { AddUserProfileProps } from '../../../../types';
import { responsiveDesign } from '../../theme/Theme';
import { GENDER, LOCATION, PRONOUNS } from '../../../../constants';

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
  const [gender, setGender] = useState<string>('');
  const [pronouns, setPronouns] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [location, setLocation] = useState<string>('');

  useEffect(() => {
    if (selectedProfile) {
      setUserId(selectedProfile.user_id);
      setImage(selectedProfile.image);
      setBio(selectedProfile.bio);
      setGender(selectedProfile.gender);
      setPronouns(selectedProfile.pronouns);
      setDateOfBirth(selectedProfile.date_of_birth);
      setLocation(selectedProfile.location);
    } else {
      setUserId(null);
      setImage('');
      setBio('');
      setGender('');
      setPronouns('');
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
      gender,
      pronouns,
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
        setGender('');
        setPronouns('');
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
      sx={{ ...responsiveDesign }}
    >
      <Typography variant="h5">Create Profile</Typography>
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
        slotProps={{ inputLabel: { shrink: true } }}
        required
        sx={{
          m: 1,
          width: '300px',
          // Apply the theme's text and background colors to the input field
          '& input': {
            color: 'text.primary', // Use theme's text color
            backgroundColor: 'background.paper', // Use theme's background color
          },
          // Style the calendar icon for webkit browsers
          '& input[type="date"]::-webkit-calendar-picker-indicator': {
            filter:
              'invert(50%) sepia(100%) saturate(500%) hue-rotate(180deg)', // Adjust this filter to change the icon's color
          },
        }}
      />
      <FormControl sx={{ m: 1, width: '300px' }}>
        <InputLabel id="gender-select-label">
          Select Gender
        </InputLabel>
        <Select
          labelId="gender-select-label"
          value={gender ?? ''}
          onChange={(e) => setGender(e.target.value)}
          label="Select gender"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {GENDER.map((gender) => (
            <MenuItem key={gender.value} value={gender.value}>
              {gender.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, width: '300px' }}>
        <InputLabel id="pronouns-select-label">
          Select Pronouns
        </InputLabel>
        <Select
          labelId="pronouns-select-label"
          value={pronouns ?? ''}
          onChange={(e) => setPronouns(e.target.value)}
          label="Select pronouns"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {PRONOUNS.map((p) => (
            <MenuItem key={p.value} value={p.value}>
              {p.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, width: '300px' }}>
        <InputLabel id="location-select-label">
          Select Location
        </InputLabel>
        <Select
          labelId="location-select-label"
          value={location ?? ''}
          onChange={(e) => setLocation(e.target.value)}
          label="Select location"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {LOCATION.map((location) => (
            <MenuItem key={location.value} value={location.value}>
              {location.label}
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
