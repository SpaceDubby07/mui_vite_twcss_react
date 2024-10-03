import { Box, Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/home/')({
  component: () => (
    <Box>
      <Typography variant="h4">
        If you are seeing this page you are not logged in
      </Typography>
    </Box>
  ),
});
