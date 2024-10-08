import { Box, Typography } from '@mui/material';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useUser } from '../../../utils/functions';
import { useEffect, useState } from 'react';

const LikesSent = () => {
  interface Like {
    id: number;
    image: string;
    name: string;
  }

  const { userId } = useUser();
  const [likesSent, setLikesSent] = useState<Like[]>([]);

  useEffect(() => {
    const fetchUserLikesSent = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/follows/sent?follower_id=${userId}`
        );
        const data = await response.json();
        setLikesSent(data);
      } catch (error) {
        console.error('Failed to fetch likes sent', error);
      }
    };
    fetchUserLikesSent();
  }, [userId]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        justifyContent: 'center',
      }}
    >
      {likesSent.map((like, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            '&:hover': {
              cursor: 'pointer',
            },
          }}
        >
          {/* linke to query a users profile and display it. */}
          <Link
            to={`/home/${userId}/likes-sent/userProfile?=${like.id}`}
          >
            <img
              src={like.image}
              alt={like.name}
              style={{
                width: '125px',
                height: '125px',
                borderRadius: '10px',
              }}
            />
            <Typography
              variant="body1"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              {like.name}
            </Typography>
          </Link>
        </Box>
      ))}
    </Box>
  );
};

export const Route = createFileRoute('/home/$userId/likes-sent')({
  component: () => (
    <Box>
      <LikesSent />
    </Box>
  ),
});
