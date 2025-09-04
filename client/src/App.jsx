import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from './pages/Profile';

const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const MainLayout = lazy(() => import("./pages/MainLayout"));
const DashboardPage = lazy(() => import("./pages/Dashboard"));
const AddFunds = lazy(() => import("./components/AddFunds"));
const Tasks = lazy(() => import("./components/Tasks"));
// const Profile = lazy(() => import("./pages/Profile"));
const Contact = lazy(() => import("./pages/Contact"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Rules = lazy(() => import("./pages/Rules"));

function App() {
  return (
    <div className="h-screen bg-[#FFFFFF]">
      <Toaster position="bottom-right" />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected layout with sidebar */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="funds" element={<AddFunds />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="profile" element={<Profile />} />
            <Route path="contact" element={<Contact />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="rules" element={<Rules />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
