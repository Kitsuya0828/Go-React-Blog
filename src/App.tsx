import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Header from './features/Header';
import Post from './features/post/Post';
import PostList from './features/post/postList';

function App() {
  return (
    <>
      <Header />
      <RouterProvider router={router} />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <PostList />,
  },
  {
    path: "/posts/:postId",
    element: <Post />,
  },
]);

export default App;