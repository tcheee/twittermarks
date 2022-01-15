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
  Button,
  TextField,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';

export default function TweetSearch() {
  const [search, setSearch] = useState('');
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
          process.env.ENV
            ? 'http://localhost:5000/api/search'
            : window.location.origin + `/api/getLikes`,
          {
            accessToken: Cookies.get('accessToken'),
            secretToken: Cookies.get('secretToken'),
            userId: user_id,
          }
        );
        console.log(data);
        setInitialTweets(data);
        setFilteredTweets(data);
        setLoading(false);
      } catch (err) {
        console.log(err);
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
      initialTweets.filter((tweet) =>
        tweet.text.includes(searchSentence || searchSentence.toUpperCase())
      )
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
          Searching @{username} tweets
        </Typography>
        <TextField
          id="outlined-basic"
          variant="outlined"
          sx={{
            backgroundColor: 'red',
            width: '400px',
            borderColor: 'red',
            outline: 'none',
          }}
          onChange={(e) => searchTweet(e)}
        />
      </Box>
      <Grid
        container
        spacing={4}
        sx={{ mt: '10px', overflow: 'auto', maxHeight: 530 }}
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
                    maxWidth: 345,
                    minHeight: 220,
                    minWidth: 320,
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
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        color="#FFFFFF"
                      >
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
          <Box>
            <Loader
              lines={14}
              length={15}
              width={5}
              radius={30}
              corners={1}
              rotate={0}
              direction={1}
              color="#FFFFFF"
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
          </Box>
        )}
      </Grid>
    </Container>
  );
}
