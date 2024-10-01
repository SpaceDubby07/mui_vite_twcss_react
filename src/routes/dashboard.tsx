import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  createFileRoute,
  Link,
  Outlet,
} from '@tanstack/react-router';
import { theme } from '../components/theme/Theme';
import ThemeToggle from '../components/theme/ThemeToggle';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PostAddIcon from '@mui/icons-material/PostAdd';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState } from 'react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const drawerWidth = 250; // Define your drawer width

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const links = [
    { text: 'Home', icon: <HomeRoundedIcon />, path: '/dashboard' },
    { text: 'Users', icon: <PersonIcon />, path: '/dashboard/users' },
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
    <Drawer
      variant="temporary" // Keep this as temporary for a mobile drawer
      open={open}
      onClose={onClose}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 2, // Ensure it's above the AppBar
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Toolbar />
      <Box
        sx={{
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          mt: -8,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
          }}
        >
          <Typography variant="h6">User</Typography>
          <Button onClick={onClose}>Close</Button>
        </Box>
        <Stack sx={{ flexGrow: 1, p: 1 }}>
          <List dense>
            {links.map((link) => (
              <Link key={link.text} to={link.path} onClick={onClose}>
                <ListItem disablePadding sx={{ display: 'block' }}>
                  <ListItemButton>
                    <ListItemIcon>{link.icon}</ListItemIcon>
                    <ListItemText primary={link.text} />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
          </List>
        </Stack>
      </Box>
    </Drawer>
  );
};

// Dashboard layout file
export const Route = createFileRoute('/dashboard')({
  component: function DashboardRoute() {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

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
  },
});
