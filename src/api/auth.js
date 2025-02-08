import axiosInstance from './axios';

// Login API
export const login = async (username, password) => {
 
  try {
    const response = await axiosInstance.post('/auth/login', {
      username,
      password,
    });
    localStorage.setItem('userData', JSON.stringify(response.data));  // Lưu toàn bộ response.data vào localStorage
    return response.data;  // Trả về dữ liệu token, role và userId
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// Register API
export const register = async (username, password, confirmPassword, secretKey) => {
  try {
    const response = await axiosInstance.post('/auth/register', {
      username,
      password,
      confirmPassword,
      secretKey,
    });
    return response.data;  // Trả về dữ liệu thành công
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

// Forgot Password API
export const forgotPassword = async (username, secretKey, newPassword, confirmPassword) => {
  try {
    const response = await axiosInstance.post('/auth/forgot-password', {
      username,
      secretKey,
      newPassword,
      confirmPassword,
    });
    return response.data;  // Trả về thông báo thành công
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Forgot Password failed');
  }
};

// Get User Profile API
export const getUserProfile = async () => {
  try {
    const userId = JSON.parse(localStorage.getItem('userData')).userId;
    const response = await axiosInstance.get('/user/profile',{userId});
    return response.data;  // Trả về thông tin người dùng
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
  }
};
export const updateProfile = async (query) => {
  try {
  
    const response = await axiosInstance.post('/user/profile',query);
    return response.data;  // Trả về thông tin người dùng
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
  }
};
export const deleteAddress = async (query) => {
  try {
    const response = await axiosInstance.post('/user/profile/delete',query);
    return response.data;  // Trả về thông tin người dùng
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
  }
};
export default { login, register, forgotPassword, getUserProfile,updateProfile,deleteAddress };