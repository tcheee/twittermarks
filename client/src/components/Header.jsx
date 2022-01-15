import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const Header = () => {
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setImage(Cookies.get('image'));
  }, []);

  const goHome = () => {
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1D1F23' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box onClick={() => goHome()} sx={{ cursor: 'pointer' }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              color="#1DA1F2"
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            >
              🐦 Twittermarks
            </Typography>
          </Box>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
            color="#1DA1F2"
          >
            🐦 Twittermarks
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}></Box>

          <Box sx={{ flexGrow: 0 }}>
            {image ? <Avatar alt="twitter-image" src={image} /> : null}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;
