import {
  Container,
  Typography,
  Box,
  Avatar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useUser } from '../../../utils/functions';
import {
  GENDER,
  LOCATION,
  LOOKING_FOR,
  PRONOUNS,
} from '../../../../constants';
import { UserProfile } from '../../../../types';
import ProfileImages from './ProfileImages';
import SelectField from '../../custom/SelectField';
const UserProfileComponent = () => {
  const user = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(
    null
  );
  const [bio, setBio] = useState<string>(userProfile?.bio || '');
  const [gender, setGender] = useState<string>(
    userProfile?.gender || ''
  );
  const [pronouns, setPronouns] = useState<string>(
    userProfile?.pronouns || ''
  );
  const [location, setLocation] = useState<string>(
    userProfile?.location || ''
  );
  const [relationships, setRelationships] = useState<string>(
    userProfile?.relationship_type || ''
  );

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/user_profiles/user/${user?.userId}`
        );
        const data = await response.json();
        setUserProfile(data);
        setBio(data.bio);
        setGender(data.gender);
        setPronouns(data.pronouns);
        setLocation(data.location);
        setRelationships(data.relationship_type);
      } catch (error) {
        console.error('Failed to fetch user profile', error);
      }
    };

    fetchUserProfile();
  }, [user]);

  const editProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3001/api/user_profiles/${userProfile?.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...userProfile,
            bio,
            gender,
            location,
            pronouns,
            relationship_type: relationships,
          }),
        }
      );

      const data = await response.json();
      setBio(data.bio);
      setGender(data.gender);
      setPronouns(data.pronouns);
      setLocation(data.location);
      setRelationships(data.relationship_type);
    } catch (error) {
      console.error('Failed to edit profile', error);
    }
  };

  return (
    <Container>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Profile
      </Typography>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
          <Avatar
            src={userProfile?.image}
            alt="profile image"
            sx={{ height: 96, width: 96 }}
          />
          <Box sx={{ ml: 2 }}>
            <Typography variant="h5">{user?.userName}</Typography>
            <Typography variant="h6">
              {userProfile?.date_of_birth
                ? Math.floor(
                    (new Date().getTime() -
                      new Date(userProfile.date_of_birth).getTime()) /
                      (1000 * 60 * 60 * 24 * 365.25)
                  ).toString()
                : ''}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
          <ProfileImages />
        </Box>

        <Typography variant="h5">Bio</Typography>
        <Box
          component="form"
          onSubmit={editProfile}
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
          <TextField
            label={bio ? '' : 'Edit Bio'}
            multiline
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            sx={{ m: 1 }}
          />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <SelectField
              label="Gender"
              value={gender}
              options={[...GENDER]}
              onChange={(value) => setGender(value)}
            />
            <SelectField
              label="Pronouns"
              value={pronouns}
              options={[...PRONOUNS]}
              onChange={(value) => setPronouns(value)}
            />
            <SelectField
              label="Location"
              value={location}
              options={[...LOCATION]}
              onChange={(value) => setLocation(value)}
            />

            <FormControl sx={{ m: 1, width: '300px' }}>
              <InputLabel id="relationship-select-label">
                Relationship type
              </InputLabel>
              <Select
                labelId="relationship-select-label"
                value={relationships ?? ''}
                onChange={(e) => setRelationships(e.target.value)}
                label="Select Relationship"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {LOOKING_FOR.map((relationship) => (
                  <MenuItem
                    key={relationship.value}
                    value={relationship.value}
                  >
                    {relationship.type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ m: 2 }}
          >
            Save Profile
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UserProfileComponent;
