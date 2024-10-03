import { createLazyFileRoute } from '@tanstack/react-router';
import HomeLayout from '../components/home/layout/HomeLayout';

export const Route = createLazyFileRoute('/home')({
  component: () => <HomeLayout />,
});
