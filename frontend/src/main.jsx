import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Route, RouterProvider, createRoutesFromElements} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import {Login, Signup, VerifyOTP, Landing, Home, Queries, ContactAdmin, Projects, UserProfile, AdminDashboard} from './components'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Landing/>}/>
      <Route path="home" element={<Home/>}/>
      <Route path="login" element={<Login/>}/>
      <Route path="signup" element={<Signup/>}/>
      <Route path="verify-otp" element={<VerifyOTP/>}/>
      <Route path="queries" element={<Queries/>}/>
      <Route path="projects" element={<Projects/>}/>
      <Route path="contact-admin" element={<ContactAdmin/>}/>
      <Route path="user-profile" element={<UserProfile/>}/>
      <Route path="admin-dashboard" element={<AdminDashboard/>}/>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
