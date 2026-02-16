import React from 'react'
import { Route, Routes } from 'react-router'
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import { useAuthStore } from './store/useAuthStore';

function App() {

  const { authUser, isloading, login} = useAuthStore(); 

  console.log("authUser:", authUser);
  console.log("isloading:", isloading);
  console.log("login:",   login);

  return (
    <div className = "min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">

    {/* decoreators - grid bg & glow shapes */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
    <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
    <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />

    <Routes>
      <Route path="/" element={<ChatPage />} /> 
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
    {/* <button onClick={login} className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded">Login</button> */}
    </div>
  )
}

export default App


