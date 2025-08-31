import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from 'react-router-dom';

const Signup = lazy(()=> import('./pages/Signup'));
const Login = lazy(()=> import('./pages/Login'));
const Dashboard = lazy(()=> import('./pages/Dashboard'));

function App() {
  return (
    <div>
      <Toaster position="bottom-right" />
      <Suspense fallback={"Loading..."} >
        <Routes>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/" element={<Dashboard/>}/>
        </Routes>
      </Suspense>
    </div>
  )
}

export default App