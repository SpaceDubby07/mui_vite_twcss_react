import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home/$userId/settings')({
  component: () => <div>Hello /home/$userId/settings!</div>,
})
