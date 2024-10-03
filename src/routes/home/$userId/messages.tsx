import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home/$userId/messages')({
  component: () => <div>Hello /home/$userId/messages!</div>,
})
