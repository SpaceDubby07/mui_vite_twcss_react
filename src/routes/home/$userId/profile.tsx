import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home/$userId/profile')({
  component: () => <div>Hello /home/$userId/profile!</div>,
})
