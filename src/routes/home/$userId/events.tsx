import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home/$userId/events')({
  component: () => <div>Hello /home/$userId/events!</div>,
})
