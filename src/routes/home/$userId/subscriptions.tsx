import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';

const Subscriptions = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
      }}
    >
      <Typography variant="h4">Subscription</Typography>
      <Box>
        <Typography variant="body1">
          Your premium subscription offers the following benefits:
        </Typography>
        <Typography variant="body1">
          <ul>
            <li>Ad-free browsing</li>
            <li>Increased profile visibility</li>
            <li>Premium search filters</li>
            <li>Priority customer support</li>
          </ul>
        </Typography>
      </Box>
      <Box>
        <Typography variant="h5">Monthly Charges</Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="right">Cost</TableCell>
                <TableCell align="right">Card</TableCell>
                <TableCell align="right">Purchase Date</TableCell>
                <TableCell align="right">Expiration</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(12)].map((_, i) => (
                <TableRow
                  key={i}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toLocaleString()}
                  </TableCell>
                  <TableCell align="right">$10.99</TableCell>
                  <TableCell align="right">Visa</TableCell>
                  <TableCell align="right">
                    {new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    {new Date(Date.now() + (12 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button variant="contained">View Receipt</Button>
        <Button variant="contained" color="error">
          Cancel Subscription
        </Button>
      </Box>
    </Box>
  );
};

export const Route = createFileRoute('/home/$userId/subscriptions')({
  component: () => (
    <Box>
      <Subscriptions />
    </Box>
  ),
});
