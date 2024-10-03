import { createLazyFileRoute } from '@tanstack/react-router';
import HomeLayout from '../components/home/layout/HomeLayout';
import UserProvider from '../providers/UserContext';

export const Route = createLazyFileRoute('/home')({
  component: () => (
    <UserProvider>
      <HomeLayout />
    </UserProvider>
  ),
});
