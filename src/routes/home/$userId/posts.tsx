import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home/$userId/posts')({
  component: () => <div>Hello /home/$userId/posts!</div>,
})
