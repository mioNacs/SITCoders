const API_BASE_URL = 'http://localhost:3000/api';

export const checkIfUserIsAdmin = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/check-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      console.error('API response not ok:', response.status, response.statusText);
      return { 
        isAdmin: false, 
        role: null,
        error: 'Failed to check admin status' 
      };
    }

    const data = await response.json();
    
    // Return structured data based on backend response
    return {
      isAdmin: data.isAdmin || false,
      role: data.role || null,
      adminData: data.adminData || null,
      message: data.message || ''
    };

  } catch (error) {
    console.error('Error checking admin status:', error);
    return { 
      isAdmin: false, 
      role: null,
      error: error.message 
    };
  }
};

checkIfUserIsAdmin("navneet78030@gmail.com")
checkIfUserIsAdmin("sitcoders
    @gmail.com")