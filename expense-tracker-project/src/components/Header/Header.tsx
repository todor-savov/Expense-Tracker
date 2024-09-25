import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Navigation from '../Navigation/Navigation';
import AuthContext from '../../context/AuthContext';
import { AccountBox, AccountCircle, Email, EmailOutlined, EmailRounded, EmailTwoTone, LoginOutlined, Logout, LogoutOutlined, LogoutRounded, MailLock, Settings, SportsBaseball, Twitter } from '@mui/icons-material';
import { signOutUser } from '../../service/authentication-service';
import { getUserDetails } from '../../service/database-service';
import "./Header.css";
import { Badge, Button, Icon, Popover } from '@mui/material';

interface HeaderProps {
    from: string;
    isUserChanged?: boolean;
}

interface UserDetails {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    username: string;
    photo: string;
    role: string;
    isBlocked: boolean;
}

const Header = ({ from, isUserChanged }: HeaderProps) => {
  const { isLoggedIn, setLoginState } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
  const [isNavigationOpen, setIsNavigationOpen] = useState<boolean>(false);
  const [isBadgeOpen, setIsBadgeOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserDetails|null>(null);
  const navigate = useNavigate();

  useEffect(() => {
      const fetchUserDetails = async () => {
        const userDetails = await getUserDetails(isLoggedIn.user);
        if (userDetails.length) setCurrentUser(userDetails[0]);
      }
      fetchUserDetails();
  }, [isUserChanged]);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
  };

  const handleBadgeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setIsBadgeOpen(true);
  };

  const handleBadgeClose = () => { 
    setAnchorEl(null);
    setIsBadgeOpen(false);
  }

  const handleLoginClick = () => {
    navigate('/login');
  }

  const handleLogoutClick = () => {
    signOutUser();
    setLoginState({status: false, user: ''});
    navigate('/');
  }

  const handleProfileClick = () => {
    navigate('/profile');
  }

  return (
    isNavigationOpen ? <Navigation setIsNavigationOpen={setIsNavigationOpen} /> 
    : <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => setIsNavigationOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Typography component="span"> Welcome {currentUser?.firstName}!  </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}> {from} </Typography>
          {isLoggedIn.status ? 
            <div>
              <span>
                <Button aria-describedby='simple-popover' aria-controls="simple-popover" variant="contained" onClick={handleBadgeClick}>
                  <Badge color="secondary" badgeContent={3} invisible={false}> <EmailTwoTone /> </Badge>
                </Button>

                <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true"
                  onClick={handleMenuClick} color="inherit">
                    <img id="profile-photo" src={currentUser?.photo} alt="profile" />
                </IconButton>
              </span>
              <Popover id='simple-popover' open={isBadgeOpen} anchorEl={anchorEl} onClose={handleBadgeClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right',}}
                  transformOrigin={{ vertical: 'top', horizontal: 'right',}}
              >
                  <Typography sx={{ p: 2 }}>You have not logged in any transactions in the last 3 days.</Typography>
              </Popover>
              <Menu id="menu-appbar" anchorEl={anchorEl} anchorOrigin={{vertical: 'top', horizontal: 'right',}} keepMounted
                transformOrigin={{vertical: 'top', horizontal: 'right',}} open={isMenuOpen} onClose={handleMenuClose}>
                <MenuItem onClick={handleProfileClick}><AccountCircle /> Profile </MenuItem>
                <MenuItem onClick={handleMenuClose}><Settings /> Settings </MenuItem>
                <MenuItem onClick={handleLogoutClick}><Logout /> Logout </MenuItem>
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