import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/log-in')({
  component: () => <div>Hello /log-in!</div>,
})
