import { createLazyFileRoute } from '@tanstack/react-router';
import Register from '../components/register/register';

export const Route = createLazyFileRoute('/register')({
  component: () => <Register />,
});
