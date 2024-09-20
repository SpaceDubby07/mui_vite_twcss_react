import {
  AppBar,
  Box,
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
import PersonIcon from '@mui/icons-material/Person';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PostAddIcon from '@mui/icons-material/PostAdd';
import RateReviewIcon from '@mui/icons-material/RateReview';

const drawerWidth = 240;

// Dashboard layout file
export const Route = createFileRoute('/dashboard')({
  component: () => (
    <ThemeProvider theme={theme}>
      <Box
        sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}
      >
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Typography variant="h6" noWrap component="div">
              Navigation bar
            </Typography>
            <ThemeToggle />
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: 'background.paper',
            },
          }}
        >
          <Toolbar />
          {/* This pushes the drawer content below the AppBar */}
          <Box sx={{ overflow: 'auto' }}>
            {/* Add your sidebar navigation items here */}
            <Stack
              sx={{
                flexGrow: 1,
                p: 1,
                justifyContent: 'space-between',
              }}
            >
              <List dense>
                <Link to="/dashboard">
                  <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton>
                      <ListItemIcon>
                        <HomeRoundedIcon />
                      </ListItemIcon>
                      <ListItemText primary="Home" />
                    </ListItemButton>
                  </ListItem>
                </Link>
              </List>
              <List dense>
                <Link to="/dashboard/users">
                  <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton>
                      <ListItemIcon>
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText primary="Users" />
                    </ListItemButton>
                  </ListItem>
                </Link>
              </List>
              <List dense>
                <Link to="/dashboard/userProfiles">
                  <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton>
                      <ListItemIcon>
                        <ManageAccountsIcon />
                      </ListItemIcon>
                      <ListItemText primary="User Profiles" />
                    </ListItemButton>
                  </ListItem>
                </Link>
              </List>
              <List dense>
                <Link to="/dashboard/posts">
                  <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton>
                      <ListItemIcon>
                        <PostAddIcon />
                      </ListItemIcon>
                      <ListItemText primary="Posts" />
                    </ListItemButton>
                  </ListItem>
                </Link>
              </List>
              <List dense>
                <Link to="/dashboard/comments">
                  <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton>
                      <ListItemIcon>
                        <RateReviewIcon />
                      </ListItemIcon>
                      <ListItemText primary="Comments" />
                    </ListItemButton>
                  </ListItem>
                </Link>
              </List>
            </Stack>
          </Box>
        </Drawer>
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
  ),
});
