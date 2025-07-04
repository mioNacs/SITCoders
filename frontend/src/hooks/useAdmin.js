import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { checkIfUserIsAdmin } from '../services/adminApi';

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user?.email) {
        try {
          const result = await checkIfUserIsAdmin(user.email);
          setIsAdmin(result.isAdmin || false);
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } finally {
          setLoading(false);
        }
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  return { isAdmin, loading };
};