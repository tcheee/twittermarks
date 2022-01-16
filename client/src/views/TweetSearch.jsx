import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { post } from 'axios';
import Cookies from 'js-cookie';
import Loader from 'react-loader';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Link,
  TextField,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';

export default function TweetSearch() {
  const [setSearch] = useState('');
  const [error, setError] = useState(null);
  const [initialTweets, setInitialTweets] = useState([]);
  const [filteredTweets, setFilteredTweets] = useState([]);
  const [username, setUsername] = useState('');
  const [image, setImage] = useState('');
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function getLikes(user_id) {
      try {
        setLoading(true);
        const { data } = await post(
          window.location.origin.includes('localhost')
            ? 'http://localhost:5000/api/getLikes'
            : window.location.origin + `/api/getLikes`,
          {
            accessToken: Cookies.get('accessToken'),
            secretToken: Cookies.get('secretToken'),
            userId: user_id,
          }
        );
        if (data.success) {
          setError(null);
          setInitialTweets(data.data);
          setFilteredTweets(data.data);
        } else if (data.error === 'limit') {
          setError(
            'You reach the twitter limit for search. Please come back at ' +
              data.time +
              ' (UTC time)'
          );
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError(err);
      }
    }

    const id = searchParams.get('user_id');
    if (!id) {
      navigate('/');
    } else {
      const image = searchParams.get('image');
      setImage(image.slice(0, image.search('normal')) + '400x400.jpg');
      setUsername(searchParams.get('username'));
      getLikes(id);
    }
  }, []);

  const searchTweet = (event) => {
    const searchSentence = event.target.value;
    setSearch(searchSentence);
    setFilteredTweets(
      initialTweets.filter((tweet) => {
        if (
          tweet.text.includes(searchSentence) ||
          tweet.text.includes(searchSentence.toUpperCase()) ||
          tweet.text.includes(searchSentence.toLowerCase())
        ) {
          return true;
        } else {
          return false;
        }
      })
    );
  };

  return (
    <Container className="main-container" maxWidth="false">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img
          src={image}
          alt="profile"
          width="80"
          height="80"
          style={{ borderRadius: '50%', marginTop: '5px' }}
        />
        <Typography color="#FFFFFF" sx={{ mt: '10px' }}>
          Searching @{username} likes ❤️
        </Typography>
        <TextField
          id="outlined-basic"
          variant="outlined"
          autoFocus
          placeholder=""
          sx={{
            backgroundColor: '#F4EDDE',
            width: { xs: '80vw', sm: '20vw' },
            borderColor: 'red',
            outline: 'none',
          }}
          onChange={(e) => searchTweet(e)}
        />
        {error ? (
          <Typography
            color="#FFFFFF"
            textAlign="center"
            sx={{
              mt: '10px',
              color: '#ff6961',
              fontSize: '12px',
              fontFamily: 'system-ui',
            }}
          >
            {error}
          </Typography>
        ) : null}
        {loading ? (
          <Typography
            color="#FFFFFF"
            textAlign="center"
            sx={{
              mt: { xs: '30vh', sm: '10vh' },
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            Given the twitter architecture, it can take up to 1 minute to load
            the 5000 most recent likes 😴. But to lose patience is to lose the
            battle.
          </Typography>
        ) : null}
      </Box>
      <Grid
        container
        spacing={4}
        sx={{ mt: '10px', overflow: 'auto', maxHeight: { xs: 380, sm: 530 } }}
      >
        {!loading ? (
          filteredTweets.map((tweet) => (
            <Grid
              item
              xs={12}
              md={4}
              lg={3}
              key={tweet.id}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Link
                href={`https://twitter.com/jack/status/${tweet.id}`}
                target="_blank"
                underline="none"
              >
                <Card
                  sx={{
                    maxWidth: { xs: '90vw', sm: '320px' },
                    minHeight: 220,
                    minWidth: { xs: '90vw', sm: '320px' },
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: '#1D1F23',
                    color: '#FFFFFF',
                  }}
                >
                  <CardContent>
                    <Box>
                      <Typography variant="body2" color="#FFFFFF">
                        {tweet.text}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
                <TwitterIcon sx={{ color: '#1DA1F2', mt: '-30px' }} />
              </Link>
            </Grid>
          ))
        ) : (
          <Loader
            lines={14}
            length={15}
            width={5}
            radius={30}
            corners={1}
            rotate={0}
            direction={1}
            color="#1DA1F2"
            speed={0.5}
            trail={60}
            shadow={false}
            hwaccel={false}
            className="spinner"
            zIndex={2e9}
            top="50%"
            left="50%"
            scale={1.0}
            loadedClassName="loadedContent"
          />
        )}
      </Grid>
    </Container>
  );
}
