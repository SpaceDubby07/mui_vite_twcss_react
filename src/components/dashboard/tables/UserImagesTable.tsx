import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { UserImage, UserImageTableProps } from '../../../../types';

export const UserImagesTable: React.FC<UserImageTableProps> = ({
  userImages,
  users,
  deleteUserImage,
}) => {
  // Group images by user_id
  const groupedImages = userImages.reduce(
    (acc, image) => {
      (acc[image.user_id] = acc[image.user_id] || []).push(image);
      return acc;
    },
    {} as Record<number, UserImage[]>
  );

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h4">User Images</Typography>
      {users.map((user) => {
        const userImages = groupedImages[user.id] || [];
        return (
          <Accordion key={user.id} sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${user.id}-content`}
              id={`panel-${user.id}-header`}
            >
              <Typography>
                {user.name} (User ID: {user.id})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {userImages.length > 0 ? (
                <Box>
                  {userImages.map((image) => (
                    <Box
                      key={image.id}
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
                        overflow: 'hidden',
                        mb: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          whiteSpace: 'nowrap', // Prevent text from wrapping
                          overflow: 'hidden', // Hide overflow content
                          textOverflow: 'ellipsis', // Show ellipsis when text overflows
                          maxWidth: '100%', // Set a max width for the text box
                          textAlign: 'left', // Align text to the left
                        }}
                      >
                        {image.image}
                      </Typography>
                      <img
                        src={image.image}
                        alt={`User Image ${image.id}`}
                        style={{
                          width: '100px',
                          height: 'auto',
                          marginLeft: '16px',
                        }}
                      />
                      <Button
                        startIcon={<DeleteIcon />}
                        onClick={() => deleteUserImage(image.id)}
                        color="error"
                      >
                        Delete
                      </Button>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography>
                  No images uploaded for this user.
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};
