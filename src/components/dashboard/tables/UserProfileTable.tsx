import {
  Avatar,
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
import { UserProfileTableProps } from '../../../types';

export const UserProfileTable: React.FC<UserProfileTableProps> = ({
  userProfiles,
  users,
  deleteUserProfile,
  editUserProfile,
}) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        User Profiles
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Profile ID</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Avatar</TableCell>
              <TableCell>Bio</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userProfiles.map((profile) => {
              // Find matching user by user_id
              const matchingUser = users.find(
                (user) => user.id === profile.user_id
              );

              return (
                <TableRow key={profile.id}>
                  <TableCell>{profile.id}</TableCell>
                  <TableCell>{profile.user_id}</TableCell>
                  <TableCell>
                    {matchingUser
                      ? matchingUser.name
                      : 'Unknown User'}
                  </TableCell>
                  <TableCell>
                    <Avatar alt={profile.image} src={profile.image} />
                  </TableCell>
                  <TableCell>{profile.bio}</TableCell>
                  <TableCell>{profile.date_of_birth}</TableCell>
                  <TableCell>{profile.location}</TableCell>
                  <TableCell>
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => editUserProfile(profile)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      startIcon={<DeleteIcon />}
                      onClick={() => deleteUserProfile(profile.id)}
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
