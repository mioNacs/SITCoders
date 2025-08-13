const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const createPost = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/create`, {
      method: 'POST',
      credentials: 'include', 
      body: formData, 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create post');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/delete/${postId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete post');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

export const editPost = async (postId, postData) => {
  try{
    const response = await fetch(`${API_BASE_URL}/posts/edit/${postId}`,{
      method: 'PUT',
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(postData),
    })

    if(!response.ok){
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to edit post')
    }

    return await response.json()
  }catch(error){
    console.error('Error editing post:', error)
    throw error
  }
}

export const getAllPosts = async (page = 1, limit = 10, tag) => {
  try {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (tag) params.set('tag', tag);
  const response = await fetch(`${API_BASE_URL}/posts/get-posts?${params.toString()}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch posts');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const getUserPosts = async (page = 1, limit = 10, tag) => {
  try {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (tag) params.set('tag', tag);
  const response = await fetch(`${API_BASE_URL}/posts/get-user-posts?${params.toString()}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user posts');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
};

export const getPostsByUserId = async (userId, page = 1, limit = 10, tag) => {
  try {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (tag) params.set('tag', tag);
  const response = await fetch(`${API_BASE_URL}/posts/user/${userId}?${params.toString()}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user posts');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
};

export const getPostById = async (postId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: 'GET',
      credentials: 'include',
        headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch post.');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    throw error;
  }
};