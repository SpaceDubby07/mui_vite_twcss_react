import { createFileRoute } from '@tanstack/react-router';
import {
  Box,
  Container,
  Typography,
  Link,
  Avatar,
  Skeleton,
} from '@mui/material';
import {
  useUser,
  useUserVerification,
} from '../../../utils/functions';
import { useEffect, useState } from 'react';
import { Comments, Post } from '../../../../types';

function Comp() {
  const { userId } = useUser();
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);

  console.log(posts, comments);
  // Call the user verification hook
  useUserVerification(Number(userId));

  // Fetch posts and comments on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          'http://localhost:3001/api/posts/authorDetails'
        );
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts', error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(
          'http://localhost:3001/api/comments/authorDetails'
        );
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Failed to fetch comments', error);
      }
    };

    fetchPosts();
    fetchComments();
  }, []);

  // If no user is found, take the user to the login screen or show an error message
  if (!userId) {
    return <div>No user found</div>; // Or redirect to the login page
  }

  // Extended types for posts and comments with author details
  interface PostWithAuthor extends Post {
    authorName: string;
    authorImage: string;
  }

  interface CommentWithAuthor extends Comments {
    authorName: string;
    authorImage: string;
  }

  // Updated PostCardProps with the new extended types
  interface PostCardProps {
    post: PostWithAuthor;
    comments: CommentWithAuthor[];
  }

  // Updated PostCard to filter comments per post
  const PostCard: React.FC<PostCardProps> = ({ post, comments }) => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: 3,
          m: 2,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
          border: '1px solid #ccc',
        }}
      >
        {/* Post Author */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={post.authorImage}
            alt={post.authorName}
            sx={{ mr: 2 }}
          />
          <Typography variant="h6">{post.authorName}</Typography>
        </Box>

        {/* Post Title and Content */}
        <Typography variant="h5" component="h2" gutterBottom>
          <Link href={`/home/${post.user_id}/posts/${post.id}`}>
            {post.title}
          </Link>
        </Typography>
        <Typography variant="body1" gutterBottom>
          {post.content}
        </Typography>

        {/* Comments Section */}
        {comments.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Comments
            </Typography>
            {comments.map((comment) => (
              <Box
                key={comment.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Avatar
                    src={comment.authorImage}
                    alt={comment.authorName}
                    sx={{ mr: 2 }}
                  />
                  <Typography variant="body1">
                    {comment.authorName}
                  </Typography>
                </Box>
                <Typography variant="body2">
                  {comment.content}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(comment.created_at).toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Container fixed maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          justifyContent: {
            xs: 'center',
            xl: 'start',
          },
          marginX: 'auto',
        }}
      >
        {/* Card structure */}
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              comments={comments.filter(
                (comment) => comment.post_id === post.id
              )}
            />
          ))
        ) : (
          <Skeleton variant="rectangular" width={480} height={210} />
        )}
      </Box>
    </Container>
  );
}

export const Route = createFileRoute('/home/$userId/')({
  component: () => <Comp />,
});
