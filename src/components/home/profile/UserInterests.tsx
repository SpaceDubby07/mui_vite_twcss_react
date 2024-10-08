import { useEffect, useState } from 'react';
import { Interests, User_interests } from '../../../../types';
import { useUser } from '../../../utils/functions';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const UserInterestsComponent = () => {
  const { userId } = useUser();

  const [interestList, setInterestList] = useState<Interests[]>([]);
  const [userInterests, setUserInterests] = useState<
    User_interests[]
  >([]); // Ensure this is initialized as an empty array

  useEffect(() => {
    const fetchInterestList = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/interests`
        );
        const data = await response.json();
        setInterestList(data);
      } catch (error) {
        console.error('Failed to fetch user interests', error);
      }
    };

    const fetchUserInterests = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/interests/${userId}`
        );
        const data = await response.json();

        // Check if data is an array and set it to userInterests
        if (Array.isArray(data)) {
          setUserInterests(data);
        } else {
          console.error('User interests data is not an array:', data);
          setUserInterests([]); // Reset to empty array if not valid
        }
      } catch (error) {
        console.error('Failed to fetch user interests', error);
      }
    };

    fetchUserInterests();
    fetchInterestList();
  }, [userId]);

  if (!userId) {
    return <div>loading...</div>;
  }

  // create a function to group interests by gategory
  const groupByCategory = (interests: Interests[]) => {
    const groups: Record<string, Interests[]> = {};
    interests.forEach((interest) => {
      if (!groups[interest.category]) {
        groups[interest.category] = [];
      }
      groups[interest.category].push(interest);
    });
    return groups;
  };

  // function to add an interest to the user_interests table using the interest id and userid
  const addInterest = async (interestId: number, userId: number) => {
    try {
      await fetch(`http://localhost:3001/api/interests/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interest_id: interestId,
          user_id: userId,
        }),
      });

      // update the userInterests state with the new interest and make sure the interest chip gets filled
      setUserInterests([
        ...userInterests,
        { user_id: userId, interest_id: interestId },
      ]);
    } catch (error) {
      console.error('Failed to add interest to user', error);
    }
  };

  // remove an interest id just based off the user_interest id
  const removeIneterest = async (userInterestId: number) => {
    try {
      await fetch(
        `http://localhost:3001/api/interests/${userInterestId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_interest_id: userInterestId,
          }),
        }
      );

      // then filter out the removed interest and setuserinterests state
      setUserInterests(
        userInterests.filter(
          (interest) => interest.id !== userInterestId
        )
      );
    } catch (error) {
      console.error('Failed to remove interest from user', error);
    }
  };

  // Extract interest IDs from userInterests for quick comparison
  const userInterestIds = userInterests.map(
    (interest) => interest.interest_id
  );

  return (
    <Accordion sx={{ background: 'transparent' }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          My Interests
        </Typography>
      </AccordionSummary>
      {Object.entries(groupByCategory(interestList)).map(
        ([category, items]) => (
          <Accordion key={category}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography variant="h6">{category}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {items.map((item) => (
                <Chip
                  key={item.id}
                  label={item.label}
                  color="primary"
                  variant={
                    userInterestIds.includes(item.id)
                      ? 'filled'
                      : 'outlined'
                  }
                  sx={{ mr: 1, mb: 1 }}
                  onClick={() => {
                    const userInterestId = userInterests.find(
                      (interest) => interest.interest_id === item.id
                    )?.id;
                    if (userInterestId) {
                      removeIneterest(userInterestId);
                    } else {
                      addInterest(item.id, userId);
                    }
                  }}
                />
              ))}
            </AccordionDetails>
          </Accordion>
        )
      )}
    </Accordion>
  );
};

export default UserInterestsComponent;
