import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home/$userId/blocked')({
  component: () => <div>Hello /home/$userId/blocked!</div>,
})
