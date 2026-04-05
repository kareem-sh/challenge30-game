import { RouterProvider } from "react-router-dom";
import GlobalTimerDeadlineScheduler from "./components/GlobalTimerDeadlineScheduler";
import { router } from "./router";

export default function App() {
  return (
    <>
      <GlobalTimerDeadlineScheduler />
      <RouterProvider router={router} />
    </>
  );
}
