import { Box, Button, TextField, Typography } from '@mui/material';
import { FormEvent, useState } from 'react';
import { theme } from '../theme/Theme';

export default function Register() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:3001/api/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        }
      );
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Failed to register', error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'rgba(0,0,0,0.5)',
      }}
    >
      <Box
        component="img"
        src="https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        sx={{
          height: '100vh',
          width: '100vw',
          objectFit: 'cover',
          opacity: 0.5,
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          '& > :not(style)': { m: 1 },
          maxWidth: 400,
          mx: 'auto',
          px: 4,
          py: 6,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 3,
          [theme.breakpoints.down('md')]: {
            maxWidth: '100%',
          },
        }}
      >
        <Typography variant="h4" textAlign="center">
          Create an Account
        </Typography>
        <TextField
          label="Name"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setName(e.target.value)
          }
          error={!!error}
          helperText={error}
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setEmail(e.target.value)
          }
          error={!!error}
          helperText={error}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setPassword(e.target.value)
          }
          error={!!error}
          helperText={error}
        />
        <Button type="submit" variant="contained">
          Register
        </Button>
      </Box>
    </Box>
  );
}
