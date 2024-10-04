import {
  Box,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
} from '@mui/material';
import { useState, FormEvent } from 'react';
import { AddUserImageProps, UserImage } from '../../../../types';
import { responsiveDesign } from '../../theme/Theme';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import styled from '@emotion/styled';

export const AddUserImage: React.FC<AddUserImageProps> = ({
  users,
  setImages,
}) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    null
  ); // State for image preview

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

    if (userId === null) {
      alert('Please select a user.');
      return;
    }

    if (!imageFile) {
      alert('Please upload an image file.');
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('user_id', userId.toString());

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
          user_id: userId,
          image: url,
        };

        // Update images state
        setImages((prevImages) => [...prevImages, newImage]);

        // Reset form
        setUserId(null);
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

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ ...responsiveDesign }}
    >
      <Typography variant="h5">Upload User Image</Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: {
            xl: 'row',
            lg: 'row',
            md: 'column',
            sm: 'column',
            xs: 'column',
          },
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <FormControl sx={{ m: 1 }}>
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

        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          sx={{
            whiteSpace: 'nowrap', // Prevent text from wrapping
            overflow: 'hidden', // Hide overflow text if any
            textOverflow: 'ellipsis', // Add ellipsis if text overflows
          }}
        >
          Upload files
          <VisuallyHiddenInput
            type="file"
            onChange={handleFileChange}
          />
        </Button>

        {imagePreview && ( // Show the image preview if it exists
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
        )}

        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ m: 2 }}
        >
          Upload Image
        </Button>
      </Box>
    </Box>
  );
};
