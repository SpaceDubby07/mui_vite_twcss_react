import { Box, Button, TextField, Typography } from '@mui/material';
import { FormEvent, useEffect, useState } from 'react';
import { theme } from '../theme/Theme';
import Cookies from 'js-cookie';
import { Link } from '@tanstack/react-router';
import { verifyToken } from '../../utils/functions';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  // perform a check to see if the user is already logged in and accidentally returns to the login page
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      verifyToken()
        .then((userId) => {
          window.location.href = `/home/${userId}`;
        })
        .catch((error) => {
          console.error('Failed to verify token', error);
        });
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setError('Invalid email');
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:3001/api/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        // set our cookies, token
        Cookies.set('token', data.token, { expires: 1 }); // expires in 1 day
        const token = Cookies.get('token');
        setError('');

        if (token) {
          if (Cookies.get('token')) {
            try {
              const userId = await verifyToken(); // Get the user ID from verifyToken
              // Redirect to the user's profile page
              window.location.href = `/home/${userId}`; // Use the retrieved user ID
            } catch (error) {
              console.error('Failed to verify token', error);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to login', error);
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
          Login
        </Typography>
        <TextField
          label="Email"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setEmail(e.target.value)
          }
          error={error === 'Invalid email'}
          helperText={error === 'Invalid email' ? error : ''}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setPassword(e.target.value)
          }
          error={!!error && error !== 'Invalid email'}
          helperText={error && error !== 'Invalid email' ? error : ''}
        />
        <Button type="submit" variant="contained">
          Log In
        </Button>
        <Link
          className="text-blue-400 text-center text-sm"
          to="/register"
        >
          Don't have an account? Sign Up
        </Link>
      </Box>
    </Box>
  );
}
