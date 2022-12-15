import {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {useLocation, Link} from 'react-router-dom';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import {
  fetchAsyncGetPost,
  selectPost
} from './postSlice';
import { AppDispatch } from '../../app/store';

const styles = {
  author: {
    marginTop: '10px',
    marginBottom: '10px',
  },
  body: {
    // whiteSpace: 'pre-line',
    marginBottom: '20px',
  },
  link: {
    textDecoration: 'none'
  },
};

const Post = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentPost = useSelector(selectPost);

  const location = useLocation();
  const postId = parseInt(location.pathname.split('/')[2]);

  useEffect(() => {
    dispatch(fetchAsyncGetPost(postId));
  }, []);

  return (
    <div>
      <Container fixed maxWidth="md">
        <Box sx={{ width: '100%', marginTop: '20px' }}>
          <Typography variant="h3" component="h2">{currentPost.title}</Typography>
          <Typography variant="h5" component="div" style={styles.author}>{currentPost.author}</Typography>
          <article>
            <Typography variant="body1" style={styles.body}>{currentPost.body}</Typography>
          </article>
        </Box>
        <Link to="/" style={styles.link}>
          <Button variant="outlined">Back</Button>
        </Link>
      </Container>
    </div>
  );
};

export default Post;