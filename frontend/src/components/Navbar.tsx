import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { Box } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginDrawer from './LoginDrawer';

export default function Navbar() {
    const user = useAuth();
    const {logout} = useAuth();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();


    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    function toggleLoginDrawer(newOpen: boolean) {
      setAnchorEl(null);
      setOpen(newOpen)
    }

    function redirectToProfile(){
      setAnchorEl(null);
      navigate('/user')
    }

    function logoutUser(){
      setAnchorEl(null);
      logout();
      window.location.reload();
    }

    return (

      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Book Tracker
          </Typography>
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              > {!user.user ? 
                        <Box>
                          <MenuItem onClick={()=> toggleLoginDrawer(true)}>Login</MenuItem> 
                          <Drawer open={open} onClose={() => toggleLoginDrawer(false)}>
                            <LoginDrawer />
                          </Drawer>
                        </Box>
                      :  
                      <div>
                        <MenuItem onClick={()=>redirectToProfile()}>Profile</MenuItem>
                        <MenuItem onClick={()=>logoutUser()}>Logout</MenuItem>
                      </div>    
                      }
              </Menu>
            </div>
        </Toolbar>
      </AppBar>
    )
} 