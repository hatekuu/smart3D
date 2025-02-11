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
    const response = await axiosInstance.post('/product/id',{id:productId});
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch product');
  }
};
export const findProduct = async (name) => {
  try {
    const response = await axiosInstance.post('/product/search', name);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
}
export const suggestKeyword = async (keyword) => {
  try {
    const response = await axiosInstance.get('/product/suggest-keyword', { keyword });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
}
export const reviewProduct = async (review) => { 
  try {
    const response = await axiosInstance.post('/product/review', review);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
}
export const addToCart = async (cart) => {
  try {
    const response = await axiosInstance.post('/product/cart/add', cart);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
}
export const removeFromCart = async (cart) => {
  try {
    const response = await axiosInstance.post('/product/cart/remove', cart);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
}
export const updateCart = async (cart) => {
  try {
    const response = await axiosInstance.put('/product/cart/update', cart);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
}
export const getDiscount = async () => {
  try {
    const response = await axiosInstance.get('/product/cart/getdiscount');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
}
export const applyDiscount = async (discount) => {
  try {
    const response = await axiosInstance.post('/product/cart/discount', discount);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
}
export const checkout = async (discountCode) => {
  try {
    const response = await axiosInstance.post('/product/cart/checkout', discountCode);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
}
export const getCart = async (userId) => {
  try {
    const response = await axiosInstance.post('/product/cart', {userId:userId});
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
}
export const requestReturn = async (returnOrder) => {
  try {
    const response = await axiosInstance.post('/product/return', returnOrder);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
}
export const cancelOrder = async (order) => {
  try {
    const response = await axiosInstance.post('/product/cancel', order);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
}
export const getUserOrders = async (userId) => {
  try {
    const response = await axiosInstance.post('/product/order', {userId:userId});
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch order');
  }
}
export const confirmReceived = async (confirm) => {
  try {
    const response = await axiosInstance.post('/product/confirm', confirm);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to confirm');
  }
}
export default { getDiscount,getProducts, getProductById, findProduct, suggestKeyword, reviewProduct, addToCart, removeFromCart, updateCart, applyDiscount, checkout, getCart, 
  requestReturn, cancelOrder,getUserOrders,confirmReceived };