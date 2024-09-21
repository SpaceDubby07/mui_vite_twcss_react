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
import { UserCommentsTableProps } from '../../../types';

export const UserCommentTable: React.FC<UserCommentsTableProps> = ({
  UserComments,
  users,
  posts,
  deleteUserComment,
  editUserComment,
}) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Comments
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Comment ID</TableCell>
              <TableCell>Author ID</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Post ID</TableCell>
              <TableCell>Post Title</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {UserComments.map((comment) => {
              // Find matching user by user_id
              const matchingUser = users.find(
                (user) => user.id === comment.user_id
              );

              // Find matching user by user_id
              const matchingPost = posts.find(
                (post) => post.id === comment.post_id
              );

              return (
                <TableRow key={comment.id}>
                  <TableCell>{comment.id}</TableCell>
                  <TableCell>{comment.user_id}</TableCell>
                  <TableCell>
                    {matchingUser
                      ? matchingUser.name
                      : 'Unknown title'}
                  </TableCell>
                  <TableCell>{comment.post_id}</TableCell>
                  <TableCell>
                    {matchingPost
                      ? matchingPost.title
                      : 'Unknown title'}
                  </TableCell>
                  <TableCell>{comment.content}</TableCell>
                  <TableCell>
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => editUserComment(comment)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      startIcon={<DeleteIcon />}
                      onClick={() => deleteUserComment(comment.id)}
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
