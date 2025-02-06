import axiosInstance from './axios';

// Get Product List API
export const getProducts = async (params) => {
  try {
    const response = await axiosInstance.get('/product', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
};

// Get Single Product API
export const getProductById = async (productId) => {
  try {
    const response = await axiosInstance.get(`/product/${productId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch product');
  }
};

export default { getProducts, getProductById };