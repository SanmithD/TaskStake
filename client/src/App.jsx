import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from 'react-router-dom';

const Signup = lazy(()=> import('./pages/Signup'));
const Login = lazy(()=> import('./pages/Login'));
const MainLayout = lazy(()=> import('./pages/MainLayout'));

function App() {
  return (
    <div className="h-screen bg-[#FFFFFF] " >
      <Toaster position="bottom-right" />
      <Suspense fallback={"Loading..."} >
        <Routes>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/" element={<MainLayout/>}/>
        </Routes>
      </Suspense>
    </div>
  )
}

export default App