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
  Modal,
} from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';

export default function Homepage() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
      } else if (data.error === 'Nothing was found.') {
        setError('No user was found. Please try again.');
      } else if (data.error === 'limit') {
        setError(
          'You reach the twitter limit for search. Please come back at ' +
            data.time
        );
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
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {Cookies.get('accessToken') ? (
                <>
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
                </>
              ) : (
                <>
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
                      sx={{ mt: 5 }}
                    >
                      Login via Twitter
                    </Button>
                  </Link>
                </>
              )}
              <Button
                onClick={handleOpen}
                sx={{
                  mt: Cookies.get('accessToken') ? 18 : 10,
                  fontSize: 8,
                  color: 'white',
                  fontStyle: 'italic',
                }}
              >
                More information
              </Button>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: 250, sm: 400 },
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 0,
                    p: 4,
                    overflowY: 'auto',
                    maxHeight: { xs: 380 },
                  }}
                >
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    Information about Twittermarks
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 3 }}>
                    General Information{' '}
                  </Typography>
                  <Typography id="modal-modal-description">
                    This website use the Twitter API to get the public
                    information about the user and his/her likes. Given twitter
                    policy about the usage of its service, you are limited to a
                    specific number of request per minutes. When you reach this
                    limit, the app will show it to you and you will have to wait
                    15 minutes before using it again. In order not to reach this
                    limit too fast, the search is limited to the 5000 most
                    recent likes.
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 3 }}>
                    {' '}
                    Your Data{' '}
                  </Typography>
                  <Typography id="modal-modal-description">
                    When you sign in, the app don't store any of your personal
                    information outside your personal computer.
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 3 }}>
                    {' '}
                    Specific Request{' '}
                  </Typography>
                  <Typography id="modal-modal-description">
                    If you like the app or you need more advanced features
                    (i.e.: searching on various users at the same time, get a
                    specific notification when some users like a keyword ...).
                    Feel free to reach @thomas_cherret.
                  </Typography>
                </Box>
              </Modal>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
