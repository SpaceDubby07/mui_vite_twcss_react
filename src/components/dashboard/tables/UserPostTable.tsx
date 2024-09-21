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
import { UserPostTableProps } from '../../../../types';

export const UserPostTable: React.FC<UserPostTableProps> = ({
  UserPosts,
  users,
  deleteUserPost,
  editUserPost,
}) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Posts
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Post ID</TableCell>
              <TableCell>Author ID</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {UserPosts.map((post) => {
              // Find matching user by user_id
              const matchingUser = users.find(
                (user) => user.id === post.user_id
              );

              return (
                <TableRow key={post.id}>
                  <TableCell>{post.id}</TableCell>
                  <TableCell>{post.user_id}</TableCell>
                  <TableCell>
                    {matchingUser
                      ? matchingUser.name
                      : 'Unknown User'}
                  </TableCell>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.content}</TableCell>
                  <TableCell>
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => editUserPost(post)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      startIcon={<DeleteIcon />}
                      onClick={() => deleteUserPost(post.id)}
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
