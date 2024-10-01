import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { FollowsTableProps } from '../../../../types';

export const FollowsTable: React.FC<FollowsTableProps> = ({
  follows,
  users,
  deleteFollow,
  editFollow,
}) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Follows
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Follow ID</TableCell>
              <TableCell>Follower ID</TableCell>
              <TableCell>Follwer Name</TableCell>
              <TableCell>Followed User ID</TableCell>
              <TableCell>Followed User Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {follows.map((follow) => {
              // Find matching user by user_id
              const followerName = users.find(
                (user) => user.id === follow.follower_id
              );

              // Find matching user by user_id
              const followedUserName = users.find(
                (user) => user.id === follow.followed_id
              );

              return (
                <TableRow key={follow.id}>
                  <TableCell>{follow.id}</TableCell>
                  <TableCell>{follow.follower_id}</TableCell>
                  <TableCell>
                    {followerName
                      ? followerName.name
                      : 'Unknown user'}
                  </TableCell>
                  <TableCell>{follow.followed_id}</TableCell>
                  <TableCell>
                    {followedUserName
                      ? followedUserName.name
                      : 'Unknown user'}
                  </TableCell>
                  <TableCell>
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => editFollow(follow)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      startIcon={<DeleteIcon />}
                      onClick={() => deleteFollow(follow.id)}
                      color="error"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
