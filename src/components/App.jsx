import "../styles/App.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import ErrorPage from "./common/error";
import Home from "./routes/home";
import Navbar from "./common/navbar";

function Content() {
  return (
    <div className="content">
      <div className="content-layout">
        <Outlet />
      </div>
    </div>
  );
}

function Root() {
  return (
    <div>
      <Navbar />
      <Content />
    </div>
  );
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Home />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
