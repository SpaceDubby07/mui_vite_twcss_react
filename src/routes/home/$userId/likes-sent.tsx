import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home/$userId/likes-sent')({
  component: () => <div>Hello /home/$userId/likes-sent!</div>,
})
