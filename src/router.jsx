import { createBrowserRouter } from "react-router-dom";

import Layout from "./components/Layout";

import Start from "./pages/Start";
import Settings from "./pages/Settings";
import Round1 from "./pages/Round1";
import Round2 from "./pages/Round2";
import Round3 from "./pages/Round3";
import Round4 from "./pages/Round4";
import Scoreboard from "./pages/Scoreboard";

import RoundSwitcher from "./pages/RoundSwitcher";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Start /> },
      { path: "settings", element: <Settings /> },
      { path: "round", element: <RoundSwitcher /> },
    ],
  },
  {
    path: "/scoreboard",
    element: <Scoreboard />,
  },
]);
