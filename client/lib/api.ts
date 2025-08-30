// API utility functions
const API_BASE_URL = 'https://subsidy-oa4j.onrender.com';

export const apiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = apiUrl(endpoint);
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// Helper for auth headers
export const withAuthHeaders = (options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  return {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': token ? `Bearer ${token}` : '',
    },
  };
};
