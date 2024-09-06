import * as React from 'react';
import { useState, useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Navigation from '../Navigation/Navigation';
import AuthContext from '../../context/AuthContext';
import { LoginOutlined } from '@mui/icons-material';
import { signOutUser } from '../../service/authentication-service';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    from: string;
}

const Header: React.FC<HeaderProps> = ({ from }) => {
  const { isLoggedIn, setLoginState } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
  const [isNavigationOpen, setIsNavigationOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLoginClick = () => {
    navigate('/login');
    //setAnchorEl(null);
    //setLoginState({status: false, user: ''});
  }

  const handleLogoutClick = () => {
    signOutUser();
    setLoginState({status: false, user: ''});
    setAnchorEl(null);
    navigate('/');
  }

  return (
    isNavigationOpen ? <Navigation setIsNavigationOpen={setIsNavigationOpen} /> 
    : <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => setIsNavigationOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}> {from} </Typography>
          {isLoggedIn.status ? 
            <div>
              <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true"
                onClick={handleMenu} color="inherit">
                <AccountCircle />
              </IconButton>
              <Menu id="menu-appbar" anchorEl={anchorEl} anchorOrigin={{vertical: 'top', horizontal: 'right',}} keepMounted
                transformOrigin={{vertical: 'top', horizontal: 'right',}} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>Settings</MenuItem>
                <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
              </Menu>
            </div>
            : <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true"
                onClick={handleLoginClick} color="inherit">
                <LoginOutlined />
              </IconButton>
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;  