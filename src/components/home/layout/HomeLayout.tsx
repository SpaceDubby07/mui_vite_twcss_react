import { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  ThemeProvider,
  Toolbar,
} from '@mui/material';
import Sidebar, { SidebarLink } from '../../ui/Sidebar';
import { Outlet } from '@tanstack/react-router';
import { theme } from '../../theme/Theme';
import ThemeToggle from '../../theme/ThemeToggle';

import MenuIcon from '@mui/icons-material/Menu';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonIcon from '@mui/icons-material/Person';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PostAddIcon from '@mui/icons-material/PostAdd';
import RateReviewIcon from '@mui/icons-material/RateReview';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import BlockIcon from '@mui/icons-material/Block';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChatIcon from '@mui/icons-material/Chat';
import PreviewIcon from '@mui/icons-material/Preview';


import {
  useUser,
  useUserVerification,
} from '../../../utils/functions';

export default function HomeLayout() {
  // fetch the user id from cookie
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const { userId, loading } = useUser();
  useUserVerification(Number(userId));

  if (loading) {
    return (
      <div className="mt-40 flex justify-center items-center mx-auto">
        <CircularProgress />
      </div>
    );
  }

  const links: SidebarLink[] = [
    {
      text: 'Home',
      icon: <HomeRoundedIcon />,
      path: `/home/${userId}`,
    },
    {
      text: 'My Profile',
      icon: <PersonIcon />,
      path: `/home/${userId}/profile`,
    },
    {
      text: 'Account Settings',
      icon: <ManageAccountsIcon />,
      path: `/home/${userId}/settings`,
    },
    {
      text: 'Posts',
      icon: <PostAddIcon />,
      path: `/home/${userId}/posts`,
    },
    {
      text: 'Comments',
      icon: <RateReviewIcon />,
      path: `/home/${userId}/comments`,
    },
    {
      text: 'Likes Sent',
      icon: <ThumbUpIcon />,
      path: `/home/${userId}/likes-sent`,
    },
    {
      text: 'Likes Received',
      icon: <PreviewIcon />,
      path: `/home/${userId}/likes-received`,
    },
    {
      text: 'Matches',
      icon: <FavoriteIcon />,
      path: `/home/${userId}/matches`,
    },
    {
      text: 'Messages',
      icon: <ChatIcon />,
      path: `/home/${userId}/messages`,
    },
    {
      text: 'Manage Events',
      icon: <CalendarMonthIcon />,
      path: `/home/${userId}/events`,
    },
    {
      text: 'Manage Subscriptions',
      icon: <ShoppingCartCheckoutIcon />,
      path: `/home/${userId}/subscriptions`,
    },
    {
      text: 'Manage Blocked Users',
      icon: <BlockIcon />,
      path: `/home/${userId}/blocked`,
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
          color="transparent"
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
