import { api } from '../context/AuthContext';

export const verifyIsAdmin = async (email) => {
  try {
    const response = await api.post('/api/admin/isAdmin', { email });
    return response.data;
  } catch (error) {
    console.error('Error verifying admin status:', error);
    return false;
  }
}

export const getAllUnverifiedUsers = async () => {
  try {
    const response = await api.get('/api/admin/unverified-users');
    return response.data;
  } catch (error) {
    console.error('Error fetching unverified users:', error);
    throw error;
  }
};

export const getVerifiedUsers = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/api/admin/get-verified-user?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching verified users:', error);
    throw error
  }
}

export const createAdmin = async (email, role) => {
  try {
    const response = await api.post('/api/admin/create', { email, role });
    return response.data;
  } catch (error) {
    console.error('Error creating admin:', error);
    throw error;
  }
};

export const removeFromAdmin = async (email) => {
  try {
    const response = await api.post('/api/admin/remove-from-admin', { email });
    return response.data;
  } catch (error) {
    console.error('Error removing from admin:', error);
    throw error;
  }
};

export const verifyUser = async (email) => {
  try {
    const response = await api.post('/api/admin/verify-user', { email });
    return response.data;
  } catch (error) {
    console.error('Error verifying user:', error);
    throw error;
  }
};

export const rejectUser = async (email) => {
  try {
    const response = await api.post('/api/admin/reject-user', { email });
    return response.data;
  } catch (error) {
    console.error('Error rejecting user:', error);
    throw error;
  }
};

export const suspendUser = async (email, duration, durationIn, suspensionReason) => {
  try {
    const response = await api.post('/api/admin/suspend-user', { email, duration, durationIn, suspensionReason });
    return response.data;
  } catch (error) {
    console.error('Error suspending user:', error);
    throw error;
  }
};

export const removeSuspension = async (email) => {
  try {
    const response = await api.post('/api/admin/remove-suspension', { email });
    return response.data;
  } catch (error) {
    console.error('Error removing suspension:', error);
    throw error;
  }
};

export const getSuspendedUsers = async () => {
  try {
    const response = await api.get('/api/admin/suspended-users');
    return response.data;
  } catch (error) {
    console.error('Error fetching suspended users:', error);
    throw error;
  }
};

export const searchUsersInAdmin = async (username) => {
  try {
    const response = await api.post('/api/admin/search-users', { username });
    return response.data;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

export const updateRollNo = async (userId, rollNo) => {
  try {
    const response = await api.put(`/api/admin/update-rollNo/${userId}`, { userId, rollNo });
    return response.data;
  } catch (error) {
    console.error('Error updating roll number:', error);
    throw error;
  }
}