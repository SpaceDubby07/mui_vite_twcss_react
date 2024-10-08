import { FormEvent, useEffect, useState } from 'react';
import { useUser } from '../../../utils/functions';
import { UserImage } from '../../../../types';
import styled from '@emotion/styled';
import {
  Box,
  Button,
  Card,
  Container,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

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

export default ProfileImages;
