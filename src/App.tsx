import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Story from "./pages/trial";

import Comments from "./pages/comments";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Story />,
  },
  {
    path: "/comments/:storyId",
    element: <Comments />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
