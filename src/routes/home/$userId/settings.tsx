import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useUser } from '../../../utils/functions';
import { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const AccountSettings = () => {
  const user = useUser();
  const [email, setEmail] = useState(user.userEmail);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] =
    useState(false);
  const [errors, setErrors] = useState<{
    [key: string]: string;
  } | null>(null);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const response = await fetch(
      'http://localhost:3001/api/users/dummy'
    );
    // const response = await fetch('/api/user', {
    //   method: 'PATCH',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     email,
    //     currentPassword,
    //     newPassword,
    //     confirmNewPassword,
    //   }),
    // });
    const data = await response.json();
    // const data = await response.json();
    console.log('submitted');
    if (response.ok) {
      setErrors(null);
    } else {
      setErrors(data.errors);
    }
  };

  return (
    <Box>
      <Typography variant="h4">Account Settings</Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%',
          my: 4,
        }}
      >
        <Typography variant="h6">Change your email</Typography>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={!!errors?.email}
          helperText={errors?.email}
        />
        <Button variant="contained" type="submit">
          Change Email
        </Button>
        {/* TODO: add whether or not a user is verified to the db, and perform this action */}
        {/* 
        {!user.userEmailVerified && (
          <Button
            variant="contained"
            color="error"
            sx={{ mt: 2 }}
            onClick={() => {}}
          >
            Send Verification Email
          </Button>
        )} 
         */}
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%',
        }}
      >
        {' '}
        <Typography variant="h6">Reset your password</Typography>
        <TextField
          label="Current Password"
          type={showCurrentPassword ? 'text' : 'password'}
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          error={!!errors?.currentPassword}
          helperText={errors?.currentPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() =>
                    setShowCurrentPassword(!showCurrentPassword)
                  }
                  edge="end"
                >
                  {showCurrentPassword ? (
                    <VisibilityOffIcon />
                  ) : (
                    <VisibilityIcon />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="New Password"
          type={showNewPassword ? 'text' : 'password'}
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          error={!!errors?.newPassword}
          helperText={errors?.newPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  edge="end"
                >
                  {showNewPassword ? (
                    <VisibilityOffIcon />
                  ) : (
                    <VisibilityIcon />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Confirm New Password"
          type={showConfirmNewPassword ? 'text' : 'password'}
          value={confirmNewPassword}
          onChange={(event) =>
            setConfirmNewPassword(event.target.value)
          }
          error={!!errors?.confirmNewPassword}
          helperText={errors?.confirmNewPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() =>
                    setShowConfirmNewPassword(!showConfirmNewPassword)
                  }
                  edge="end"
                >
                  {showConfirmNewPassword ? (
                    <VisibilityOffIcon />
                  ) : (
                    <VisibilityIcon />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" type="submit">
          Change Password
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          my: 10,
        }}
      >
        <Typography variant="h6">Delete Account</Typography>
        <Typography variant="body1">
          This will permanently delete your account and all associated
          data and images from our hosting service, no bullshit, no
          waiting like with other platforms.
        </Typography>
        <Button variant="contained" color="error">
          Delete Account
        </Button>
      </Box>
    </Box>
  );
};

export const Route = createFileRoute('/home/$userId/settings')({
  component: () => (
    <Box>
      <AccountSettings />
    </Box>
  ),
});
