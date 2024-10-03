import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home/$userId/matches')({
  component: () => <div>Hello /home/$userId/matches!</div>,
})
