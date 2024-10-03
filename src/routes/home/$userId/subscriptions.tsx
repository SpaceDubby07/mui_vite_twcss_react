import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home/$userId/subscriptions')({
  component: () => <div>Hello /home/$userId/subscriptions!</div>,
})
