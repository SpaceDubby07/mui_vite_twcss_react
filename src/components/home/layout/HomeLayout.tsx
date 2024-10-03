import { useState } from 'react';
import {
  Box,
  Button,
  CssBaseline,
  ThemeProvider,
} from '@mui/material';
import Sidebar, { SidebarLink } from '../../ui/Sidebar';
import { Outlet } from '@tanstack/react-router';
import { theme } from '../../theme/Theme';
import ThemeToggle from '../../theme/ThemeToggle';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PostAddIcon from '@mui/icons-material/PostAdd';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function HomeLayout() {
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
      <Box>
        <CssBaseline />

        <Button onClick={() => setSidebarOpen(true)}>
          <MenuIcon />
        </Button>
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          links={links}
        />
        <ThemeToggle />
        <Outlet />
      </Box>
    </ThemeProvider>
  );
}
