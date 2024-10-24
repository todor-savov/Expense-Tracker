import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Badge, CircularProgress, Popover, Rating, Stack } from '@mui/material';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle, Email, LoginOutlined, Logout, Settings } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { signOutUser } from '../../service/authentication-service';
import { addFeedback, getFeedbacks, getTransactions, getUserDetails } from '../../service/database-service';
import Navigation from '../Navigation/Navigation';
import AuthContext from '../../context/AuthContext';
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

interface Feedback {
    user: string;
    rating: number;
    feedback: string;
}

const Header = ({ from, isUserChanged }: HeaderProps) => {
  const { isLoggedIn, setLoginState, settings } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null);
  const [isNavigationOpen, setIsNavigationOpen] = useState<boolean>(false);
  const [isBadgeOpen, setIsBadgeOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserDetails|null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [notificationsCount, setNotificationsCount] = useState<number>(0);
  const [showFeedbackForm, setShowFeedbackForm] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<Feedback|null>(null);
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [eligibleForFeedback, setEligibleForFeedback] = useState<boolean>(false);
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
          if (settings?.activityNotifications === 'enabled') {
            const transactions = await getTransactions(isLoggedIn.user);
            transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            const differenceInTime = new Date().getTime() - new Date(transactions[0].date).getTime();
            const differenceInDays = differenceInTime / (1000 * 3600 * 24);
              if (Math.floor(differenceInDays) > 3) {
                setNotifications([...notifications, "You have not logged in any transactions in the last 3 days."]);
                setNotificationsCount(notificationsCount + 1);
              } 
          }          
      } catch (error: any) {
        console.log(error.message);
      }
    }
    if (isLoggedIn.user) fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const feedbacks = await getFeedbacks(isLoggedIn.user);
        if (feedbacks.length === 0) setEligibleForFeedback(true);
        else setEligibleForFeedback(false);        
      } catch (error: any) {
        console.log(error.message);
      }
    }
    if (isLoggedIn.user) fetchFeedbacks();    
  }, []);

  useEffect(() => {
    const addUserFeedback = async () => {
      try {
        setLoading(true);
        const status = await addFeedback(feedback as Feedback);
        if (status) throw new Error("Feedback not submitted!");
        setLoading(false);
        setIsFeedbackSubmitted(true);        
        setFeedback(null);
        setTimeout(() => handleLogout(), 2000);
      } catch (error: any) {
        setLoading(false);
        console.log(error.message);
      } 
    }
    if (feedback) addUserFeedback();
  }, [feedback]);

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

  const handleProfileClick = () => {
    navigate('/profile');
  }  

  const handleSettingsClick = () => {
    navigate('/settings');
  }

  const handleLoginClick = () => {
    navigate('/login');
  }

  const handleLogoutClick = () => {
    setIsMenuOpen(false);
    if (eligibleForFeedback) setShowFeedbackForm(true);
    else handleLogout();
  }

  const handleLogout = () => {
    setShowFeedbackForm(false);
    signOutUser();
    setLoginState({status: false, user: ''});
    navigate('/');
  }

  const handleFeedbackSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const rating = event.currentTarget['feedback-rating'].value;
    const feedback = event.currentTarget['feedback-text'].value;    
    setFeedback({ user: isLoggedIn.user, rating: parseInt(rating), feedback });
  }

  return (
    isNavigationOpen ? <Navigation setIsNavigationOpen={setIsNavigationOpen} /> 
    : <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            {from !== 'Home' &&
              <IconButton size="large" edge="start" color="inherit" aria-label="menu" onClick={() => setIsNavigationOpen(true)}>
                <MenuIcon />
              </IconButton>
            }
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
                  <MenuItem onClick={handleSettingsClick}><Settings sx={{marginRight: '7px'}} /> Settings </MenuItem>
                  <MenuItem onClick={handleLogoutClick}><Logout sx={{marginRight: '7px'}} /> Logout </MenuItem>
                </Menu>
              </div>
              : (from !== 'Home' &&
                  <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true"
                    onClick={handleLoginClick} color="inherit">
                    <LoginOutlined />
                  </IconButton>)
            }
          </Toolbar>
        </AppBar>

        {isLoggedIn.status && 
          <Box className='welcome-box'>
            <Typography component="span"> Welcome <strong>{currentUser?.firstName}</strong>! </Typography>
          </Box>
        }

        {showFeedbackForm && 
          <div className="feedback-form-overlay">
            <Box component="form" className="feedback-form" onSubmit={handleFeedbackSubmit}>
              <Typography variant="h6"> Would you like to rate the app? </Typography>
              <Rating name="feedback-rating" defaultValue={0} size="large" />          
              <TextareaAutosize name="feedback-text" aria-label="minimum height" minRows={3} 
                style={{ width: "100%", padding: "10px", borderRadius: "5px" }} 
                placeholder="Share your feedback here... (optional)"                  
              />

              <div style={{ textAlign: "right" }}>
                  {loading ? 
                    <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row">
                      <CircularProgress color="success" />
                    </Stack> 
                  : (isFeedbackSubmitted ?                   
                      <p>                    
                        <FontAwesomeIcon icon={faCircleCheck} size="2xl" style={{color: "#1daa80", 
                          marginRight: "0.7rem", marginTop: "0.5rem"}} 
                        />
                        Thank you! You will be logged out now...
                      </p>                  
                    : <div>
                        <button type="submit">Submit</button>
                        <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Skip</button>
                      </div>
                    )
                  }
              </div>                        
            </Box>
          </div>
        }
    </Box>
  );
}

export default Header;