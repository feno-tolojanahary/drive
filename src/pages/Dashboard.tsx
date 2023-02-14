import "./styles.css";
import Sidebard from "./Layout/Sidebard";
import Header from "./Layout/Header";
import DocList from "./DocList";
import Bin from "./Bin";
import Error404 from "./Error404";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import TableViewContext from "../globalState/tableViewContext";
import { useState } from "react";

export default function Dashboard() {
  const [typeTableView, setTypeTableView] = useState<string>("drive");

  const router = createBrowserRouter([
    {
      path: "/",
      element: <DocList />,
      errorElement: <Error404/>
    },
    {
      path: "archive",
      element: <Bin />
    }
  ]);

  return (
    <div className="w-full bg-white shadow-xl rounded-lg flex overflow-x-auto custom-scrollbar">
      <TableViewContext.Provider value={{
        type: typeTableView,
        updateType: setTypeTableView
      }}>
        <Sidebard />
        <div className="flex-1 px-2">
          <Header />
          <div className="mb-6 pt-4"> 
              <RouterProvider router={router} />
          </div>
        </div>
      </TableViewContext.Provider >
    </div>
  );
}
