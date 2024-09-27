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
import { AccountCircle, Email, LoginOutlined, Logout, Settings } from '@mui/icons-material';
import { signOutUser } from '../../service/authentication-service';
import { getTransactions, getUserDetails } from '../../service/database-service';
import { Badge, Popover } from '@mui/material';
import "./Header.css";

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
  const [notifications, setNotifications] = useState<string[]>([]);
  const [notificationsCount, setNotificationsCount] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
      const fetchUserDetails = async () => {
        try {
          const userDetails = await getUserDetails(isLoggedIn.user);
          if (userDetails.length) setCurrentUser(userDetails[0]);
        } catch (error: any) {
          console.log(error.message);
        }
      }
      if (isLoggedIn.user) fetchUserDetails();
  }, [isUserChanged]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactions = await getTransactions(isLoggedIn.user);
        transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const differenceInTime = new Date().getTime() - new Date(transactions[0].date).getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        if (Math.floor(differenceInDays) > 3) {
          setNotifications([...notifications, "You have not logged in any transactions in the last 3 days."]);
          setNotificationsCount(notificationsCount + 1);
        }
      } catch (error: any) {
        console.log(error.message);
      }
    }
    if (isLoggedIn.user) fetchTransactions();
  }, []);

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
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 1 }} onClick={() => setIsNavigationOpen(true)}>
            <MenuIcon />
          </IconButton>
          {isLoggedIn.status && <Typography component="span"> Welcome {currentUser?.firstName}! </Typography>}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}> {from} </Typography>
          {isLoggedIn.status ? 
            <div>
              <span>
                <IconButton aria-describedby='simple-popover' aria-controls="simple-popover" onClick={handleBadgeClick}>
                  <Badge color="secondary" badgeContent={notificationsCount} invisible={false}>
                    <Email sx={{color: 'white'}} />
                  </Badge>
                </IconButton>

                <IconButton aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true"
                  onClick={handleMenuClick} color="inherit">
                    <img id="profile-photo" src={currentUser?.photo} alt="profile" />
                </IconButton>
              </span>
              <Popover id='simple-popover' open={isBadgeOpen} anchorEl={anchorEl} onClose={handleBadgeClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right',}}
                  transformOrigin={{ vertical: 'top', horizontal: 'right',}}
              >
                  <Typography sx={{ p: 2 }}> 
                    {!notifications.length ? 
                      "There are no notifications currently." : 
                      notifications.map((notification, index) => {
                      return <p key={index}> {notification} </p>
                    })}
                  </Typography>
              </Popover>
              <Menu id="menu-appbar" anchorEl={anchorEl} anchorOrigin={{vertical: 'bottom', horizontal: 'right',}} keepMounted
                transformOrigin={{vertical: 'top', horizontal: 'right',}} open={isMenuOpen} onClose={handleMenuClose}>
                <MenuItem onClick={handleProfileClick}><AccountCircle sx={{marginRight: '7px'}} /> Profile </MenuItem>
                <MenuItem onClick={handleMenuClose}><Settings sx={{marginRight: '7px'}} /> Settings </MenuItem>
                <MenuItem onClick={handleLogoutClick}><Logout sx={{marginRight: '7px'}} /> Logout </MenuItem>
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