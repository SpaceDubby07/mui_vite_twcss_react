import {
  Box,
  Button,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';

const Contact = () => {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            m: 2,
            p: 2,
            width: '30%',
            border: '1px solid #ccc',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">Feedback</Typography>
          <Typography variant="body1">
            Give us your feedback on our website
          </Typography>
        </Box>
        <Box
          sx={{
            m: 2,
            p: 2,
            width: '30%',
            border: '1px solid #ccc',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">FAQ</Typography>
          <Typography variant="body1">
            Frequently asked questions about our website
          </Typography>
        </Box>
        <Box
          sx={{
            m: 2,
            p: 2,
            width: '30%',
            border: '1px solid #ccc',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">Submit a bug report</Typography>
          <Typography variant="body1">
            Report any issues you encounter on our website
          </Typography>
        </Box>
      </Box>
      {/* create a search bar here */}
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <TextField
          fullWidth
          placeholder="Search"
          variant="outlined"
          sx={{
            mr: 2,
          }}
        />
        <Button variant="contained">Search</Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        {[...Array(8)].map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={70}
            sx={{ mb: 2 }}
          />
        ))}
      </Box>
    </Box>
  );
};

export const Route = createFileRoute('/home/$userId/contactUs')({
  component: () => (
    <Box>
      <Contact />
    </Box>
  ),
});
