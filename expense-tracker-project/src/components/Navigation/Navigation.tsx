import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faHouseUser, faLayerGroup, faMoneyBill1Wave, faScaleUnbalancedFlip } from '@fortawesome/free-solid-svg-icons';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
        {<List>
            <ListItem key={'Home'} disablePadding onClick={() => navigate('/')}>
                <ListItemButton>
                    <ListItemIcon><FontAwesomeIcon icon={faHouseUser} size="2xl" style={{color: "#FFD43B",}} /></ListItemIcon>
                    <ListItemText primary={'Home'} />
                </ListItemButton>
            </ListItem>

            <ListItem key={'Transactions'} disablePadding onClick={() => navigate('/transactions')}>
                <ListItemButton>
                    <ListItemIcon><FontAwesomeIcon icon={faMoneyBill1Wave} size="2xl" style={{color: "#63E6BE",}} /></ListItemIcon>
                    <ListItemText primary={'Transactions'} />
                </ListItemButton>
            </ListItem>

            <ListItem key={'Categories'} disablePadding onClick={() => navigate('/')}>
                <ListItemButton>
                    <ListItemIcon><FontAwesomeIcon icon={faLayerGroup} size="2xl" style={{color: "#B197FC",}} /></ListItemIcon>
                    <ListItemText primary={'Categories'} />
                </ListItemButton>
            </ListItem>

            <ListItem key={'Overview & Stats'} disablePadding onClick={() => navigate('/overview')}>
                <ListItemButton>
                    <ListItemIcon><FontAwesomeIcon icon={faChartLine} size="2xl" style={{color: "#e72d18",}} /></ListItemIcon>
                    <ListItemText primary={'Overview & Stats'} />
                </ListItemButton>
            </ListItem>

            <ListItem key={'Budget & Goals'} disablePadding onClick={() => navigate('/')}>
                <ListItemButton>
                    <ListItemIcon><FontAwesomeIcon icon={faScaleUnbalancedFlip} size="2xl" style={{color: "#0a89eb",}} /></ListItemIcon>
                    <ListItemText primary={'Budget & Goals'} />
                </ListItemButton>
            </ListItem>
        </List>}
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>Load Side Menu</Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}

export default Navigation;