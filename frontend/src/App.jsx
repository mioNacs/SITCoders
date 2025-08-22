import { useState, useEffect } from 'react'
import { Landing, Home, Footer, Header, Loading } from './components'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop';
import { useAuth } from './context/AuthContext'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CodeEnhancer from './components/UI/CodeEnhancer';

function App() {
  const { isLoggedIn, isLoading, isAuthenticated } = useAuth();

  // CodeEnhancer handles Prism highlighting and code UX globally
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    // Only run redirect logic after auth state is determined
    if (isLoading) return;
    
    // Redirect logic
    if (isLoggedIn && (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/verify-otp')) {
      navigate('/home');
    } else if (!isLoggedIn && (location.pathname === '/home' || location.pathname === '/Resources' || location.pathname === '/Collaborate' || location.pathname === '/contact-admin' || location.pathname === '/profile' || location.pathname === '/settings' || location.pathname === '/admin-dashboard')) {
      navigate('/');
    }
  }, [isLoggedIn, location.pathname, navigate, isLoading]); // Added isLoading to dependencies

  if (!isLoading) {
    return (
      <Loading/>
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
    <div className="App">
      <>
  <CodeEnhancer />
        <ScrollToTop />
        {isLoggedIn && <Header />}
        <Outlet />
      </>
      
      {/* Add ToastContainer at the end */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}

export default App

