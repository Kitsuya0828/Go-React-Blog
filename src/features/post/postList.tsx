import React, { useEffect, useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Link} from "react-router-dom";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  fetchAsyncGetPost,
  fetchAsynchGetPosts,
  fetchAsyncNewPost,
  fetchAsyncDeletePost,
  selectPosts,
  selectPost, fetchAsyncUpdatePost,
  Post
} from './postSlice';
import { AppDispatch } from '../../app/store';

// Style
const styles = {
  container: {
    marginTop: '20px'
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  },
  link : {
    width: '100%'
  }
};

const PostList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector(selectPosts);
  const currentPost = useSelector(selectPost);


  // 初回レンダリング時にpostの一覧を取得
  useEffect(() => {
    dispatch(fetchAsynchGetPosts());
  }, []);

  // Editモーダル起動時に選択されたpostの値をセット
  useEffect(() => {
    setInputPost({
      id: currentPost.id,
      title: currentPost.title,
      body: currentPost.body,
      author: currentPost.author
    });
  }, [currentPost]);

  // Modalが開いているかどうか管理するstate
  const [open, setOpen] = useState(false);
  // 入力中の内容を管理するstate
  const [inputPost, setInputPost] = useState<Post>({
    id: null,
    title: "",
    body: "",
    author: ""
  });
  // 更新用にモーダルを起動しているかどうかを管理するstate
  const [isEdit, setIsEdit] = useState(false);

  // 作成用Modalの起動
  const handleOpen = () => {
    setOpen(true);
    setIsEdit(false);
  }
  // 更新用Modalの起動
  const handleOpenEdit = (id: any) => {
    setOpen(true);
    setIsEdit(true);
    dispatch(fetchAsyncGetPost(id))
  }
  // モーダルを閉じる
  const handleClose = () => {
    setInputPost({
      id: null,
      title: "",
      body: "",
      author: ""
    });
    setOpen(false);
  }

  // Form入力時のハンドラ
  const handleInputTitle = (e: any) => {
    setInputPost({
      ...inputPost,
      title: e.target.value
    });
  }
  const handleInputBody = (e: any) => {
    setInputPost({
      ...inputPost,
      body: e.target.value
    });
  }
  const handleInputAuthor = (e: any) => {
    setInputPost({
      ...inputPost,
      author: e.target.value
    });
  }

  // CREATEボタンクリック時の処理
  const handleClickCreate = (e: any) => {
    dispatch(fetchAsyncNewPost(inputPost));
    setInputPost({
      id: null,
      title: "",
      body: "",
      author: ""
    });
    setOpen(false);
  }
  // UPDATEボタンクリック時の処理
  const handleClickUpdate = (e: any) => {
    dispatch(fetchAsyncUpdatePost(inputPost));
    setInputPost({
      id: null,
      title: "",
      body: "",
      author: ""
    });
    setOpen(false);
  }

  // 削除ボタンクリック時の処理
  const handleClickDelete = (id: number) => {
    dispatch(fetchAsyncDeletePost(id));
  }

  return (
    <div>
      <Container fixed maxWidth="md" style={styles.container}>
          <Button variant="outlined" onClick={handleOpen}>ADD POST</Button>
          <List>
            {posts && (
                posts.map((post: Post) => (
                  <ListItem key={post.id}>
                    <Link to={`/posts/${post.id}`} style={styles.link}>
                      <ListItemButton>
                        {post.id} - {post.title}
                      </ListItemButton>
                    </Link>
                    <ListItemSecondaryAction>
                      <IconButton
                        type="button"
                        edge="end"
                        aria-label="Edit"
                        value={post.id as number}
                        onClick={() => handleOpenEdit(post.id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        type="button"
                        edge="end"
                        aria-label="delete"
                        value={post.id as number}
                        onClick={() => handleClickDelete(post.id as number)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                )))
            }

          </List>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={styles.modal}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              { isEdit ? "Edit Post" : "Create Post" }
            </Typography>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { my: 1 },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="title"
                label="Title"
                value={inputPost.title}
                required
                fullWidth
                onChange={handleInputTitle}
              />
              <TextField
                id="body"
                label="Body"
                value={inputPost.body}
                multiline
                rows={4}
                required
                fullWidth
                onChange={handleInputBody}
              />
              <TextField
                id="author"
                label="Author"
                value={inputPost.author}
                required fullWidth
                onChange={handleInputAuthor}
              />
              <Stack direction="row" spacing={2}>
                <Button
                  id="save"
                  variant="outlined"
                  color="secondary"
                  onClick={handleClose}
                >
                  CANCEL
                </Button>
                {
                  isEdit
                    ? <Button id="save" variant="outlined" onClick={handleClickUpdate}>UPDATE</Button>
                    : <Button id="save" variant="outlined" onClick={handleClickCreate}>CREATE</Button>
                }

              </Stack>
            </Box>
          </Box>
        </Modal>
      </Container>
    </div>
  );
};

export default PostList;