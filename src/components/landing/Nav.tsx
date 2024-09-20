import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link } from '@tanstack/react-router';

export default function Nav() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const open = Boolean(anchorEl);
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MenuIcon />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>
          <a href="#featured">Features</a>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <a href="#pricing">Pricing</a>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link to="/sign-up">Sign Up</Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link to="/log-in">Log In</Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link to="/dashboard">Dashboard</Link>
        </MenuItem>
      </Menu>
    </div>
  );
}
