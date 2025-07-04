import { useState, useEffect } from 'react'
import { Landing, Home, Footer, Header } from './components'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop';
import { useAuth } from './context/AuthContext'

function App() {
  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only run redirect logic after auth state is determined
    if (isLoading) return;
    
    // Redirect logic
    if (isLoggedIn && (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/verify-otp')) {
      navigate('/home');
    } else if (!isLoggedIn && (location.pathname === '/home' || location.pathname === '/queries' || location.pathname === '/projects' || location.pathname === '/contact-admin' || location.pathname === '/user-profile' || location.pathname === '/admin-dashboard')) {
      navigate('/');
    }
  }, [isLoggedIn, location.pathname, navigate, isLoading]); // Added isLoading to dependencies

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (location.pathname === '/') {
    return (
      <>
        {isLoggedIn && <Header />}
        {isLoggedIn ? 
          <div>Redirecting to home...</div> : 
          <div>
            <Landing />
          </div>
        }
      </>
    );
  }

  return (
    <>
      <ScrollToTop />
      {isLoggedIn && <Header />}
      <Outlet />
    </>
  )
}

export default App
