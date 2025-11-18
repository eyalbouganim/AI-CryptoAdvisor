import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
} from '@mui/material';

const TopMenu = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.firstName + ' ' + user.lastName, 'User');
      } catch (e) {
        setUserName(storedUser);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Hello {userName}
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Log Out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopMenu;