import "./styles.css";
import Sidebard from "./Layout/Sidebard";
import Header from "./Layout/Header";
import DocList from "./DocList";
import Error404 from "./Error404";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

export default function Dashboard() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <DocList />,
      errorElement: <Error404/>
    },
  ]);

  return (
    <div className="w-full bg-white shadow-xl rounded-lg flex overflow-x-auto custom-scrollbar">
      <Sidebard />
      <div className="flex-1 px-2">
        <Header />
        <div className="mb-6 pt-4"> 
          <RouterProvider router={router} />
        </div>
      </div>
    </div>
  );
}
