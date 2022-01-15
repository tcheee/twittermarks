import '../App.css';
import React, { useState } from 'react';
import { get, post } from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
  Container,
  Typography,
  Box,
  Link,
  Button,
  TextField,
} from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';

export default function Homepage() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const searchUser = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const { data } = await post(
        process.env.ENV
          ? 'http://localhost:5000/api/search'
          : window.location.origin + `/api/search`,
        {
          accessToken: Cookies.get('accessToken'),
          secretToken: Cookies.get('secretToken'),
          username: username[0] === '@' ? username.substring(1) : username,
        }
      );
      console.log(data);
      if (data.success) {
        console.log(data.data);
        console.log(data.data.id);
        navigate(
          `/search?user_id=${data.data.id}&username=${data.data.username}&image=${data.data.profile_image_url}`
        );
      } else if (data.data === 'Nothing was found.') {
        setError('No user was found. Please try again.');
      }
    } catch (err) {
      console.log(err);
    }
    setUsername('');
  };

  return (
    <Container className="main-container" maxWidth="false">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="88vh"
      >
        <Box
          sx={{
            backgroundColor: '#1D1F23',
            borderRadius: '1em',
            alignItems: 'center',
          }}
          minHeight="50vh"
          minWidth="50vw"
        >
          <Typography
            variant="h4"
            sx={{ textAlign: 'center', mt: '2vh', fontWeight: 'bold' }}
            color="#FFFFFF"
          >
            Easily browse twitter likes ❤️
          </Typography>
          <Box
            sx={{
              display: 'flex',
              mt: '70px',
              justifyContent: 'center',
            }}
          >
            {Cookies.get('accessToken') ? (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  sx={{
                    backgroundColor: 'red',
                    width: '400px',
                    borderColor: 'red',
                    outline: 'none',
                  }}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button
                  variant="contained"
                  size="small"
                  sx={{ mt: '20px', width: '100px' }}
                  onClick={(e) => searchUser(e)}
                >
                  Search
                </Button>
              </Box>
            ) : (
              <Link
                href={'http://localhost:5000/api/twitterSignIn'}
                underline="none"
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<TwitterIcon />}
                >
                  Login via Twitter
                </Button>
              </Link>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
