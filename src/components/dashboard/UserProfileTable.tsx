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

interface UserProfile {
  id: number;
  user_id: number;
  bio: string;
  date_of_birth: string;
  location: string;
}

interface UserProfileTableProps {
  userProfiles: UserProfile[];
  deleteUserProfile: (id: number) => void;
  editUserProfile: (profile: UserProfile) => void;
}

export const UserProfileTable: React.FC<UserProfileTableProps> = ({
  userProfiles,
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
              <TableCell>User ID</TableCell>
              <TableCell>Bio</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userProfiles.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell>{profile.user_id}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
