import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/matches')({
  component: () => <div>Hello /dashboard/matches!</div>,
})
