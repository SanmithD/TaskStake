import {
  Contact2,
  DollarSign,
  Home,
  Lock,
  Menu,
  Puzzle,
  ScrollText,
  UserCircle2Icon,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

function MainLayout() {
  const [mobileView, setMobileView] = useState(false);

  const navItems = [
    { path: "/", label: "Dashboard", icon: <Home className="size-6" /> },
    { path: "/funds", label: "Add Fund", icon: <DollarSign className="size-6" /> },
    { path: "/tasks", label: "Tasks", icon: <Puzzle className="size-6" /> },
    { path: "/profile", label: "Profile", icon: <UserCircle2Icon className="size-6" /> },
    { path: "/contact", label: "Contact", icon: <Contact2 className="size-6" /> },
    { path: "/privacy", label: "Privacy Policy", icon: <Lock className="size-6" /> },
    { path: "/rules", label: "Rules", icon: <ScrollText className="size-6" /> },
  ];

  const renderNavButton = ({ path, label, icon }) => (
    <NavLink
      key={path}
      to={path}
      end
      className={({ isActive }) =>
        `w-full gap-1 flex items-center text-left px-2 py-2 rounded ${
          isActive ? "bg-blue-500 text-white" : "hover:bg-gray-200"
        }`
      }
      onClick={() => setMobileView(false)}
    >
      {icon} {label}
    </NavLink>
  );

  return (
    <div className="h-screen mx-4 text-black flex">
      <div
        className={`${mobileView ? "border-r" : "border-0"} ${
          mobileView ? "w-full" : "w-0"
        } pr-4 py-6 space-y-4`}
      >
        <div className="flex pr-3 items-center justify-between">
          {mobileView ? (
            <img src="TaskStakeImg.png" alt="logo" className="h-20 w-full" />
          ) : null}
          <button
            className="block md:hidden"
            onClick={() => setMobileView(!mobileView)}
          >
            {mobileView ? <X /> : <Menu />}
          </button>
        </div>
        {mobileView ? <div>{navItems.map(renderNavButton)}</div> : null}
      </div>

      <div className="hidden md:block border-r w-80 pr-4 py-6 space-y-4">
        <img src="TaskStakeImg.png" alt="logo" className="h-20 w-full" />
        {navItems.map(renderNavButton)}
      </div>

      <div className="w-full p-6 overflow-y-auto flex justify-center">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
