import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export type Post = {
	id: number | null
	title: string
	body: string
	author: string
}

type State = {
  currentPost: Post
  posts: Post[]
}

// APIへリクエストし、指定したIDの投稿を1件取得する
export const fetchAsyncGetPost = createAsyncThunk(
  'post/get',
  async (id: number) => {
    const response = await axios.get(`${apiBaseUrl}/posts/${id}`);
    return response.data;
  }
);

// APIへリクエストし、投稿の一覧を取得する
export const fetchAsynchGetPosts = createAsyncThunk(
  'post/list',
  async () => {
    const response = await axios.get(`${apiBaseUrl}/posts`)
    return response.data;
  }
);

// APIへリクエストして新規に投稿を作成する
export const fetchAsyncNewPost = createAsyncThunk(
  'post/post',
  async (inputPost: Post) => {
    const response = await axios.post(`${apiBaseUrl}/posts/`, inputPost, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }
);

// APIへリクエストし、指定したIDの投稿を更新する
export const fetchAsyncUpdatePost = createAsyncThunk(
  'post/put',
  async (inputPost: Post) => {
    const response = await axios.put(`${apiBaseUrl}/posts/${inputPost.id}`, inputPost, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }
);

// APIへリクエストし、指定したIDの投稿を削除する
export const fetchAsyncDeletePost = createAsyncThunk(
  'post/delete',
  async (id: number) => {
    const response = await axios.delete(`${apiBaseUrl}/posts/${id}`);
    return response.data
  }
)

export const postSlice = createSlice({
  name: 'post',
  initialState: {
    currentPost: {
      id: null,
      title: '',
      body: '',
      author: ''
    },
    posts: []
  } as State,
  reducers: {},
  extraReducers: (builder) => {
    // fetchAsyncGetPostが成功した場合にstateのcurrentPostにAPIからのレスポンスをセットする
    builder.addCase(fetchAsyncGetPost.fulfilled, (state, action) => {
      return {
        ...state,
        currentPost: action.payload
      };
    });
    // fetchAsynchGetPostsが成功した場合にstateのpostsにAPIからのレスポンスをセットする
    builder.addCase(fetchAsynchGetPosts.fulfilled, (state, action) => {
      return {
        ...state,
        posts: action.payload === null ? [] : action.payload
      }
    });
    // fetchAsyncNewPostが成功した場合にstateのpostsにAPIからのレスポンスを追加する
    builder.addCase(fetchAsyncNewPost.fulfilled, (state, action) => {
      return {
        ...state,
        posts: [...state.posts, action.payload]
      }
    });
    // fetchAsyncNewPostが成功した場合にstateのpostsにAPIからのレスポンスを追加する
    builder.addCase(fetchAsyncUpdatePost.fulfilled, (state, action) => {
      console.log(action.payload)
      let posts = state.posts.filter((item: Post) => item.id !== action.payload.id)
      posts = {posts, ...action.payload}
      posts.sort((a: Post, b: Post) => {
        if (a.id != null && b.id != null) {
          return a.id - b.id
        }
        return 0
      })
      return {
        ...state,
        posts: posts
      }
    });
    // fetchAsyncDeletePostが成功した場合にstateのpostsから削除したIDの投稿を削除します
    builder.addCase(fetchAsyncDeletePost.fulfilled, (state, action) => {
      return {
        ...state,
        posts: state.posts.filter((item: Post) => item.id !== action.payload.id)
      }
    })
  }
});

// stateからcurrentPostを取得する
export const selectPost = (state: any) => state.post.currentPost;
// stateからpostsを取得する
export const selectPosts = (state: any) => state.post.posts;

export default postSlice.reducer;