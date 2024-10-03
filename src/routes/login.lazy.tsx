import { createLazyFileRoute } from '@tanstack/react-router';
import Login from '../components/login/Login';

export const Route = createLazyFileRoute('/login')({
  component: () => <Login />,
});
