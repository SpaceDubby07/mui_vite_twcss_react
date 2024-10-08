import { Container, Divider } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import UserProfileComponent from '../../../components/home/profile/UserProfile';
import UserInterestsComponent from '../../../components/home/profile/UserInterests';

export const Route = createFileRoute('/home/$userId/profile')({
  component: () => (
    <Container maxWidth="lg">
      <UserProfileComponent />
      <Divider sx={{ my: 4 }} />
      <UserInterestsComponent />
    </Container>
  ),
});
