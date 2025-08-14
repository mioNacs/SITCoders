import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Route, RouterProvider, createRoutesFromElements} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import {Login, Signup, VerifyOTP, Landing, Home, Resources, ContactAdmin, Collaborate, UserProfile, AdminDashboard, PostView, ForgotPassword, Settings} from './components'
import { AuthProvider } from './context/AuthContext.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Landing/>}/>
      <Route path="home" element={<Home/>}/>
      <Route path="login" element={<Login/>}/>
      <Route path="forgot-password" element={<ForgotPassword/>}/>
      <Route path="signup" element={<Signup/>}/>
      <Route path="verify-otp" element={<VerifyOTP/>}/>
      <Route path="Resources" element={<Resources/>}/>
      <Route path="Collaborate" element={<Collaborate/>}/>
      <Route path="contact-admin" element={<ContactAdmin/>}/>
      <Route path="post/:postId" element={<PostView/>}/>
      <Route path="profile/:username?" element={<UserProfile/>}/>
      <Route path="settings" element={<Settings/>}/>
      <Route path="admin-dashboard" element={<AdminDashboard/>}/>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </StrictMode>
)
