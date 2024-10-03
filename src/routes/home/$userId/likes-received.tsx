import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home/$userId/likes-received')({
  component: () => <div>Hello /home/$userId/likes-received!</div>,
})
