import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';

const BlockedUsers = () => {
  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Picture</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>John Doe</TableCell>
            <TableCell>
              <img src="https://picsum.photos/50" alt="avatar" />
            </TableCell>
            <TableCell>
              <Button variant="outlined" color="error">
                UnBlock
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jane Doe</TableCell>
            <TableCell>
              <img src="https://picsum.photos/51" alt="avatar" />
            </TableCell>
            <TableCell>
              <Button variant="outlined" color="error">
                UnBlock
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};

export const Route = createFileRoute('/home/$userId/blocked')({
  component: () => (
    <Box>
      <BlockedUsers />
    </Box>
  ),
});
