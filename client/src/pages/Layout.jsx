import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Loading from "../components/Loading";
import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";

const Layout = () => {
  const user = useSelector((state)=>state.user.value);
  const [sideBarOpen, SetsideBarOpen] = useState(false);

  return user ? (
    <div className="w-full flex h-screen bg-amber-400">
      <Sidebar sideBarOpen={sideBarOpen} SetsideBarOpen={SetsideBarOpen} />
      <div className="flex-1 bg-slate-300">
        <Outlet />
      </div>
      {sideBarOpen ? (
        <X
          className="absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden"
          onClick={() => SetsideBarOpen(false)}
        />
      ) : (
        <Menu
          className="absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden"
          onClick={() => SetsideBarOpen(true)}
        />
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default Layout;
