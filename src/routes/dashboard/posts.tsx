import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/posts')({
  component: function PostsRoute() {
    return <div>Posts Route</div>;
  },
});
