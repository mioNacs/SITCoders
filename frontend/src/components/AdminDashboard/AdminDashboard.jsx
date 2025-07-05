import React, {useState, useEffect} from 'react'
import { useAuth } from "../../context/AuthContext";
import { verifyIsAdmin } from '../../services/adminApi'
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const { user} = useAuth();
  const [adminStatus, setAdminStatus] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  

    const getAdminStatus = async () => {
      if (user && user.email) {
        const isAdmin = await verifyIsAdmin(user.email);
        return isAdmin;
      }
      return false;
    };
    useEffect(() => {
      getAdminStatus().then((res) => {
        if(!res.isAdmin) {
          navigate('/')
        }
        setIsLoading(false);
      });
    }, []);
    

    if (isLoading) {
    return (
      <div className="pt-20 bg-orange-50 min-h-screen flex justify-center items-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className='pt-20 h-screen bg-orange-50'>
      <div className='md:max-w-[90%] h-full lg:max-w-[80%] mx-auto'>
        Admin Dashboard
      </div>
    </div>
  )
}

export default AdminDashboard
