import { useState, useEffect } from 'react'
import { Landing, Home, Footer, Header } from './components'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
    setIsLoading(false);

    // Redirect logic
    if (user && (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/verify-otp')) {
      navigate('/home');
    } else if (!user && (location.pathname === '/home' || location.pathname === '/queries' || location.pathname === '/projects' || location.pathname === '/contact-admin' || location.pathname === '/user-profile' || location.pathname === '/admin-dashboard')) {
      navigate('/');
    }
    setIsLoading(false);
  }, [navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      {isLoggedIn && <Header />}
      <Outlet />
      {isLoggedIn && <Footer />}
    </>
  )
}

export default App
