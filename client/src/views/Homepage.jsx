import '../App.css';
import React, { useState } from 'react';
import { post } from 'axios';
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
        window.location.origin.includes('localhost')
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
              mt: '40px',
              justifyContent: 'center',
            }}
          >
            {Cookies.get('accessToken') ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <TextField
                  id="outlined-basic"
                  autoFocus
                  variant="outlined"
                  placeholder="Search a twitter username (ex.: @jack)"
                  sx={{
                    backgroundColor: '#F4EDDE',
                    width: { xs: '85vw', sm: '30vw' },
                    outline: 'none',
                    border: 'none',
                  }}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button
                  variant="contained"
                  sx={{
                    mt: '20px',
                    width: '150px',
                    size: { xs: 'large', sm: 'large' },
                    fontSize: { xs: '20px', sm: '20px' },
                  }}
                  onClick={(e) => searchUser(e)}
                >
                  Search
                </Button>
              </Box>
            ) : (
              <Link
                href={
                  window.location.origin.includes('localhost')
                    ? 'http://localhost:5000/api/twitterSignIn'
                    : window.location.origin + `/api/twitterSignIn`
                }
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
