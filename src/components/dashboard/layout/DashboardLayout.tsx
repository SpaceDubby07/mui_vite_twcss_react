import { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import Sidebar, { SidebarLink } from '../../ui/Sidebar';
import { Outlet } from '@tanstack/react-router';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PostAddIcon from '@mui/icons-material/PostAdd';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { theme } from '../../theme/Theme';
import ThemeToggle from '../../theme/ThemeToggle';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const links: SidebarLink[] = [
    { text: 'Home', icon: <HomeRoundedIcon />, path: '/dashboard' },
    {
      text: 'Users',
      icon: <PersonIcon />,
      path: '/dashboard/users',
    },
    {
      text: 'User Profiles',
      icon: <ManageAccountsIcon />,
      path: '/dashboard/userProfiles',
    },
    {
      text: 'User Images',
      icon: <PhotoLibraryIcon />,
      path: '/dashboard/userImages',
    },
    {
      text: 'Posts',
      icon: <PostAddIcon />,
      path: '/dashboard/posts',
    },
    {
      text: 'Comments',
      icon: <RateReviewIcon />,
      path: '/dashboard/comments',
    },
    {
      text: 'Follows',
      icon: <ThumbsUpDownIcon />,
      path: '/dashboard/follows',
    },
    {
      text: 'Matches',
      icon: <FavoriteIcon />,
      path: '/dashboard/matches',
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Button onClick={() => setSidebarOpen(true)}>
              <MenuIcon />
            </Button>
            <Sidebar
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              links={links}
            />
            <Typography variant="h6" noWrap component="div">
              Admin Panel
            </Typography>
            <ThemeToggle />
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}
        >
          <Toolbar />
          {/* This pushes the main content below the AppBar */}
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
