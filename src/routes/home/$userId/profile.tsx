import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useUser } from '../../../utils/functions';
import { FormEvent, useEffect, useState } from 'react';
import {
  Interests,
  User_interests,
  UserImage,
  UserProfile,
} from '../../../../types';
import styled from '@emotion/styled';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  GENDER,
  LOCATION,
  LOOKING_FOR,
  PRONOUNS,
} from '../../../../constants';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
const Profile = () => {
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
      console.log(data);
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
                  <MenuItem
                    key={location.value}
                    value={location.value}
                  >
                    {location.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ m: 1, width: '300px' }}>
              <InputLabel id="relationship-select-label">
                Select relationship status
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

const ProfileImages = () => {
  const user = useUser();
  const [images, setImages] = useState<UserImage[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    null
  ); // State for image preview

  useEffect(() => {
    const fetchProfileImages = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/uploads/user/${user?.userId}`
        );
        const data = await response.json();
        setImages(data.images); // Update to access the images array from the response
      } catch (error) {
        console.error('Failed to fetch user images', error);
      }
    };

    fetchProfileImages();
  }, [user]);

  // to upload an image
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);

      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (user?.userId === null) {
      alert('Please select a user.');
      return;
    }

    if (!imageFile) {
      alert('Please upload an image file.');
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('user_id', user?.userId.toString());

    try {
      const response = await fetch(
        'http://localhost:3001/api/uploads',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (response.ok) {
        const { url } = await response.json();
        const newImage: UserImage = {
          id: Date.now(), // Assuming you set the ID in the DB and return it
          user_id: user?.userId,
          image: url,
        };

        // Update images state
        setImages((prevImages) => [...prevImages, newImage]);

        // Reset form
        setImageFile(null);
        setImagePreview(null); // Reset the image preview
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Failed to upload image', error);
    }
  };

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  // To Delete an image
  const deleteImage = async (id: number) => {
    const imageToDelete = images.find((image) => image.id === id);

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
        const updatedUserImages = images.filter(
          (image) => image.id !== id
        );
        setImages(updatedUserImages);
      }
    } catch (error) {
      console.error('Failed to delete user image', error);
    }
  };

  return (
    <Container sx={{ mt: 2 }}>
      <Box>
        <Box
          sx={{
            mb: 5,
          }}
        >
          {!imagePreview && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="h5">Profile Images</Typography>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                sx={{
                  whiteSpace: 'nowrap', // Prevent text from wrapping
                  overflow: 'hidden', // Hide overflow text if any
                  textOverflow: 'ellipsis', // Add ellipsis if text overflows
                }}
              >
                Add Image
                <VisuallyHiddenInput
                  type="file"
                  onChange={handleFileChange}
                />
              </Button>
            </Box>
          )}

          {imagePreview && ( // Show the image preview if it exists
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box
                component="img"
                src={imagePreview}
                alt="Image Preview"
                sx={{
                  width: 200,
                  height: 200,
                  objectFit: 'cover',
                  borderRadius: 1,
                }} // Style the preview
              />

              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ m: 2 }}
                startIcon={<CloudUploadIcon />}
              >
                Upload Image
              </Button>
              <Button
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                }}
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            justifyContent: {
              xl: 'space-between',
              lg: 'space-between',
              md: 'center',
              sm: 'center',
              xs: 'center',
            },
            alignItems: 'center',
            flexWrap: 'wrap',
            flexDirection: {
              xs: 'column',
              sm: 'row',
              md: 'row',
              lg: 'row',
              xl: 'row',
            },
          }}
        >
          {images.map((image) => (
            <Box key={image.id}>
              <Card sx={{ position: 'relative' }}>
                <img
                  key={image.id}
                  src={image.image}
                  className="h-80 w-72 rounded-md"
                />
                <Tooltip arrow title="Delete Image" placement="right">
                  <IconButton
                    aria-label="delete image"
                    onClick={() => deleteImage(image.id)}
                    sx={{
                      position: 'absolute',
                      top: 5,
                      right: 4,
                      zIndex: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Tooltip>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

const UserInterests = () => {
  const { userId } = useUser();

  const [interestList, setInterestList] = useState<Interests[]>([]);
  const [userInterests, setUserInterests] = useState<
    User_interests[]
  >([]); // Ensure this is initialized as an empty array

  useEffect(() => {
    const fetchInterestList = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/interests`
        );
        const data = await response.json();
        setInterestList(data);
      } catch (error) {
        console.error('Failed to fetch user interests', error);
      }
    };

    const fetchUserInterests = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/interests/${userId}`
        );
        const data = await response.json();

        // Check if data is an array and set it to userInterests
        if (Array.isArray(data)) {
          setUserInterests(data);
        } else {
          console.error('User interests data is not an array:', data);
          setUserInterests([]); // Reset to empty array if not valid
        }
      } catch (error) {
        console.error('Failed to fetch user interests', error);
      }
    };

    fetchUserInterests();
    fetchInterestList();
  }, [userId]);

  if (!userId) {
    return <div>loading...</div>;
  }

  // create a function to group interests by gategory
  const groupByCategory = (interests: Interests[]) => {
    const groups: Record<string, Interests[]> = {};
    interests.forEach((interest) => {
      if (!groups[interest.category]) {
        groups[interest.category] = [];
      }
      groups[interest.category].push(interest);
    });
    return groups;
  };

  // function to add an interest to the user_interests table using the interest id and userid
  const addInterest = async (interestId: number, userId: number) => {
    try {
      await fetch(`http://localhost:3001/api/interests/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interest_id: interestId,
          user_id: userId,
        }),
      });

      // update the userInterests state with the new interest and make sure the interest chip gets filled
      setUserInterests([
        ...userInterests,
        { user_id: userId, interest_id: interestId },
      ]);
    } catch (error) {
      console.error('Failed to add interest to user', error);
    }
  };

  // remove an interest id just based off the user_interest id
  const removeIneterest = async (userInterestId: number) => {
    try {
      await fetch(
        `http://localhost:3001/api/interests/${userInterestId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_interest_id: userInterestId,
          }),
        }
      );

      // then filter out the removed interest and setuserinterests state
      setUserInterests(
        userInterests.filter(
          (interest) => interest.id !== userInterestId
        )
      );
    } catch (error) {
      console.error('Failed to remove interest from user', error);
    }
  };

  // Extract interest IDs from userInterests for quick comparison
  const userInterestIds = userInterests.map(
    (interest) => interest.interest_id
  );

  return (
    <Accordion sx={{ background: 'transparent' }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          My Interests
        </Typography>
      </AccordionSummary>
      {Object.entries(groupByCategory(interestList)).map(
        ([category, items]) => (
          <Accordion key={category}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography variant="h6">{category}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {items.map((item) => (
                <Chip
                  key={item.id}
                  label={item.label}
                  color="primary"
                  variant={
                    userInterestIds.includes(item.id)
                      ? 'filled'
                      : 'outlined'
                  }
                  sx={{ mr: 1, mb: 1 }}
                  onClick={() => {
                    const userInterestId = userInterests.find(
                      (interest) => interest.interest_id === item.id
                    )?.id;
                    if (userInterestId) {
                      removeIneterest(userInterestId);
                    } else {
                      addInterest(item.id, userId);
                    }
                  }}
                />
              ))}
            </AccordionDetails>
          </Accordion>
        )
      )}
    </Accordion>
  );
};

export const Route = createFileRoute('/home/$userId/profile')({
  component: () => (
    <Container maxWidth="lg">
      <Profile />
      <Divider sx={{ my: 4 }} />
      <UserInterests />
    </Container>
  ),
});
