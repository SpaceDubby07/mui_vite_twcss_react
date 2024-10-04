import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { Link } from '@tanstack/react-router';

export interface SidebarLink {
  text: string;
  icon: React.ReactElement;
  path: string;
}

export interface SidebarProps {
  open: boolean;
  onClose: () => void;
  links: SidebarLink[];
  name?: string;
}

const drawerWidth = 250; // Define your drawer width

const Sidebar: React.FC<SidebarProps> = ({
  open,
  onClose,
  links,
  name = 'User',
}) => {
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
          <Typography variant="h6">{name}</Typography>
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

export default Sidebar;
