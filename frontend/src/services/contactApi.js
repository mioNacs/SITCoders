import { api } from '../context/AuthContext';

// Get all admins for contact form
export const getAllAdmins = async () => {
  try {
    const response = await api.get('/api/contact/all-admins');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Send email to admin
export const sendEmailToAdmin = async (adminId, message) => {
  try {
    const response = await api.post('/api/contact/send-email', {
      adminId,
      message
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
