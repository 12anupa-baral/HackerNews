import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserList from "./pages/user-list";
import UserInfo from "./pages/user-info";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserList />,
  },
  {
    path: "/:userId",
    element: <UserInfo />,
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
