import "../styles/App.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import ErrorPage from "./common/error";
import Home from "./routes/home";
import Game from "./routes/game";
import Leaderboard from "./routes/leaderboard";
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
        {
          path: "/game",
          element: <Game />,
        },
        {
          path: "/leaderboard",
          element: <Leaderboard />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
