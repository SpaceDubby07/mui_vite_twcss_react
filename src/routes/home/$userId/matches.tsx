import {
  Box,
  Button,
  ImageList,
  ImageListItem,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Match } from '../../../../types';
import { useUser } from '../../../utils/functions';

type MatchWithJoins = Match & {
  matched_user_name: string;
  matched_user_image_upload: string[]; // or string[] if multiple images
};

const UserMatches = () => {
  const { userId } = useUser();
  const [matches, setMatches] = useState<MatchWithJoins[]>([]);
  console.log(matches);

  useEffect(() => {
    const fetchUserMatches = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/matches/user/${userId}`
        );
        const data = await response.json();

        // Reduce the data to eliminate duplicates and accumulate uploads
        //  TODO
        // @ts-expect-error acc and current do not have types, yet
        const reducedMatches = data.reduce((acc, current) => {
          // Use `id` as the unique key, or you can use another unique identifier
          const matchId = current.id;

          // If this matchId already exists, accumulate image uploads
          if (acc[matchId]) {
            // If matched_user_image_upload is already an array, push new image
            if (
              Array.isArray(acc[matchId].matched_user_image_upload)
            ) {
              acc[matchId].matched_user_image_upload.push(
                current.matched_user_image_upload
              );
            } else {
              // Initialize as array with the existing image and push the new one
              acc[matchId].matched_user_image_upload = [
                acc[matchId].matched_user_image_upload,
                current.matched_user_image_upload,
              ];
            }
          } else {
            // If match doesn't exist yet, initialize it
            acc[matchId] = {
              ...current,
              matched_user_image_upload: [
                current.matched_user_image_upload,
              ], // Start with an array
            };
          }

          return acc;
        }, {});

        // Convert the object back to an array
        setMatches(Object.values(reducedMatches));
      } catch (error) {
        console.error('Failed to fetch matches', error);
      }
    };

    fetchUserMatches();
  }, [userId]);

  return (
    <Box>
      <Typography variant="h4">Matches</Typography>
      <List
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          '@media (min-width: 600px)': {
            flex: 1,
          },
        }}
      >
        {matches.map((match) => (
          <ListItem
            key={match.id}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              py: 4,
              px: 2,
              borderRadius: 1,
              backgroundColor: 'background.paper',
              '@media (min-width: 600px)': {
                flexDirection: 'row',
                alignItems: 'center',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 0.5,
                '@media (min-width: 600px)': {
                  flex: 1,
                },
              }}
            >
              <Typography variant="body1">
                {match.matched_user_name}
              </Typography>
              <Typography variant="body2">
                Matched {new Date(match.matched_at).toLocaleString()}
              </Typography>
              <ImageList
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 1,
                  '@media (min-width: 600px)': {
                    flex: 'none',
                  },
                }}
              >
                {match.matched_user_image_upload.map(
                  (image, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={image}
                        alt={`Matched user image for match ${match.id}`}
                        style={{
                          width: 75,
                          height: 75,
                          objectFit: 'cover',
                        }}
                      />
                    </ImageListItem>
                  )
                )}
              </ImageList>
            </Box>
            <Box
              sx={{
                ml: 'auto',
                display: 'flex',
                gap: 1,
                '@media (min-width: 600px)': {
                  flex: 'none',
                },
              }}
            >
              <Button variant="outlined" size="small">
                View Profile
              </Button>
              <Button variant="contained" size="small" color="error">
                Remove
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export const Route = createFileRoute('/home/$userId/matches')({
  component: () => (
    <Box>
      <UserMatches />
    </Box>
  ),
});
