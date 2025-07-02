const API_BASE_URL = 'http://localhost:3000/api';

export const signupUser = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/create`, {
      method: 'POST',
      body: formData, // FormData object for file upload
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'OTP verification failed');
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const resendOTP = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/resend-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to resend OTP');
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    return data;
  } catch (error) {
    throw error;
  }
};