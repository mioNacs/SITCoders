import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Route,
  RouterProvider,
  createRoutesFromElements,
} from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import {
  Login,
  Signup,
  VerifyOTP,
  Landing,
  Home,
  Resources,
  ContactAdmin,
  Collaborate,
  UserProfile,
  AdminDashboard,
  SinglePostView,
  ForgotPassword,
  Settings,
  LeaderBoard,
} from "./components";
import { AuthProvider } from "./context/AuthContext.jsx";
import { PostsProvider } from "./context/PostsContext.jsx";
import { PostUIProvider } from "./context/PostUIContext.jsx";
import { CommentsUIProvider } from "./context/CommentsUIContext.jsx";
import { PopularityProvider } from "./context/PopularityContext.jsx";
import { ResourcesProvider } from "./context/ResourcesContext.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorPage />}>
      <Route path="" element={<Landing />} />
      <Route path="home" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="signup" element={<Signup />} />
      <Route path="verify-otp" element={<VerifyOTP />} />
      <Route path="Resources" element={<Resources />} />
      <Route path="Collaborate" element={<Collaborate />} />
      <Route path="contact-admin" element={<ContactAdmin />} />
      <Route path="post/:postId" element={<SinglePostView />} />
      <Route path="profile/:username?" element={<UserProfile />} />
      <Route path="settings" element={<Settings />} />
      <Route path="admin-dashboard" element={<AdminDashboard />} />
      <Route path="leaderboard" element={<LeaderBoard />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <PopularityProvider>
        <PostsProvider>
          <PostUIProvider>
            <CommentsUIProvider>
              <ResourcesProvider>
                <RouterProvider router={router} />
              </ResourcesProvider>
            </CommentsUIProvider>
          </PostUIProvider>
        </PostsProvider>
      </PopularityProvider>
    </AuthProvider>
  </StrictMode>
);
