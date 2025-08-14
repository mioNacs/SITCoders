import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navigation = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <div className="hidden md:flex gap-4 justify-center text-lg">
      <NavLink
        to="/home"
        className={({ isActive }) =>
          `${
            isActive ? "text-orange-400" : "text-gray-600"
          } hover:text-orange-400 transition-colors duration-300 ease-in-out`
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/Resources"
        className={({ isActive }) =>
          `${
            isActive ? "text-orange-400" : "text-gray-600"
          } hover:text-orange-400 transition-colors duration-300 ease-in-out`
        }
      >
        Resources
      </NavLink>
      <NavLink
        to="/Collaborate"
        className={({ isActive }) =>
          `${
            isActive ? "text-orange-400" : "text-gray-600"
          } hover:text-orange-400 transition-colors duration-300 ease-in-out`
        }
      >
        Collaborate
      </NavLink>
      <NavLink
        to="/contact-admin"
        className={({ isActive }) =>
          `${
            isActive ? "text-orange-400" : "text-gray-600"
          } hover:text-orange-400 transition-colors duration-300 ease-in-out`
        }
      >
        Contact
      </NavLink>
    </div>
  );
};

export default Navigation;
