import "../styles/App.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { useState } from "react";
import ErrorPage from "./common/error";
import Home from "./routes/home";
import Game from "./routes/game";
import Leaderboard from "./routes/leaderboard";
import Navbar from "./common/navbar";
import { AppContext } from "../utils/contextProvider";

function Content() {
  const [currentPlayer, setCurrentPlayer] = useState(null);

  return (
    <AppContext.Provider value={{ currentPlayer, setCurrentPlayer }}>
      <div className="content">
        <div className="content-layout">
          <Outlet />
        </div>
      </div>
      <div className="area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </AppContext.Provider>
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
    {
      path: "/error",
      element: <ErrorPage />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
