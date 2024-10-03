import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home/$userId/comments')({
  component: () => <div>Hello /home/$userId/comments!</div>,
})
