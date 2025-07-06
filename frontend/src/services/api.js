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

export const updateProfilePicture = async (formData) => {
  try{
    const response = await fetch(`${API_BASE_URL}/users/update-profile-picture`,{
      method: 'POST',
      credentials: 'include',
      body: formData
    });

    const data = await response.json();
    if(!response.ok) {
      throw new Error(data.message || 'Failed to update profile picture');
    }
    return data;
  } catch(error){
    throw error;
  }
}

export const updateTextDetails = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/update-text-details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData) // Send as JSON
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update user details');
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateBio = async (bioData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/update-bio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(bioData) // Send as JSON: { bio: "your bio text" }
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update bio');
    }
    return data;
  } catch (error) {
    throw error;
  }
};

