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
import { lazy, Suspense, useState } from "react";
import Loader from "../components/Loader";

const AddFunds = lazy(() => import("../components/AddFunds"));
const Tasks = lazy(() => import("../components/Tasks"));
const DashboardPage = lazy(() => import("./Dashboard"));
const Profile = lazy(() => import("./Profile"));
const PrivacyPolicy = lazy(() => import("./PrivacyPolicy"));
const Rules = lazy(() => import("./Rules"));
const Contact = lazy(() => import("./Contact"));

function MainLayout() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileView, setMobileView] = useState(false);

  return (
    <div className="h-screen mx-4 text-black flex">
      <div
        className={`${mobileView ? "border-r" : "border-0"} ${
          mobileView ? "w-full" : "w-0"
        } pr-4 py-6 space-y-4`}
      >
        <div className="flex pr-3">
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
        {mobileView ? (
          <div>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full gap-1 flex items-center text-left px-2 py-2 rounded ${
                activeTab === "dashboard"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <Home className="size-6" /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab("funds")}
              className={`w-full gap-1 flex items-center text-left px-2 py-2 rounded ${
                activeTab === "funds"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <DollarSign className="size-6" /> Add Fund
            </button>
            <button
              onClick={() => setActiveTab("task")}
              className={`w-full gap-1 flex items-center text-left px-2 py-2 rounded ${
                activeTab === "task"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <Puzzle className="size-6" /> Tasks
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full gap-1 flex items-center text-left px-2 py-2 rounded ${
                activeTab === "profile"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <UserCircle2Icon className="size-6" /> Profile
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`w-full gap-1 flex items-center text-left px-2 py-2 rounded ${
                activeTab === "contact"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <Contact2 className="size-6" /> Contact
            </button>
            <button
          className={`w-full gap-1 flex items-center text-left px-2 py-2 rounded ${
            activeTab === "privacy"
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("privacy")}
        >
          <Lock className="size-6"/> Privacy Policy
        </button>
        <button
          className={`w-full gap-1 flex items-center text-left px-2 py-2 rounded ${
            activeTab === "rules"
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("rules")}
        >
          <ScrollText className="size-6"/> Rules
        </button>
          </div>
        ) : null}
      </div>

      <div className={`hidden md:block border-r w-80 pr-4 py-6 space-y-4`}>
        <img src="TaskStakeImg.png" alt="logo" className="h-20 w-full" />
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`w-full gap-1 flex items-center text-left px-2 py-2 rounded ${
            activeTab === "dashboard"
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-200"
          }`}
        >
          <Home className="size-6" /> Dashboard
        </button>
        <button
          onClick={() => setActiveTab("funds")}
          className={`w-full gap-1 flex items-center text-left px-2 py-2 rounded ${
            activeTab === "funds"
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-200"
          }`}
        >
          <DollarSign className="size-6" /> Add Fund
        </button>
        <button
          onClick={() => setActiveTab("task")}
          className={`w-full gap-1 flex items-center text-left px-2 py-2 rounded ${
            activeTab === "task"
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-200"
          }`}
        >
          <Puzzle className="size-6" /> Tasks
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`w-full gap-1 flex items-center text-left px-2 py-2 rounded ${
            activeTab === "profile"
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-200"
          }`}
        >
          <UserCircle2Icon className="size-6" /> Profile
        </button>
        <button
              onClick={() => setActiveTab("contact")}
              className={`w-full gap-1 flex items-center text-left px-2 py-2 rounded ${
                activeTab === "contact"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              <Contact2 className="size-6" /> Contact
            </button>
        <button
          className={`w-full gap-1 flex items-center text-left px-2 py-2 rounded ${
            activeTab === "privacy"
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("privacy")}
        >
          <Lock className="size-6"/> Privacy Policy
        </button>
        <button
          className={`w-full gap-1 flex items-center text-left px-2 py-2 rounded ${
            activeTab === "rules"
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("rules")}
        >
          <ScrollText className="size-6"/> Rules
        </button>
      </div>
      <div className="w-full p-6 overflow-y-auto flex justify-center">
        <Suspense fallback={<Loader />}>
          {activeTab === "dashboard" && <DashboardPage />}
          {activeTab === "funds" && <AddFunds />}
          {activeTab === "task" && <Tasks />}
          {activeTab === "profile" && <Profile />}
          {activeTab === "contact" && <Contact />}
          {activeTab === "privacy" && <PrivacyPolicy />}
          {activeTab === "rules" && <Rules />}
        </Suspense>
      </div>
    </div>
  );
}

export default MainLayout;
