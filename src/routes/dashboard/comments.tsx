import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/comments')({
  component: function CommentsRoute() {
    return <div>Comments Route</div>;
  },
});
