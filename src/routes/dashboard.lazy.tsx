import { createLazyFileRoute } from '@tanstack/react-router'
import DashboardLayout from '../components/dashboard/layout/DashboardLayout'

// Dashboard layout file
export const Route = createLazyFileRoute('/dashboard')({
  component: () => <DashboardLayout />,
})
