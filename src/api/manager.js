import axiosInstance from "./axios";
const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get('/manager/users');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
}
const getOrders = async () => {
    try {
        const response = await axiosInstance.get('/manager/orders');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
}
const updateOrderStatus = async (order) => {
    try {
        const response = await axiosInstance.put('/manager/orders/update', order);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update order status');
    }
}
const getRevenueReport = async () => {
    try {
        const response = await axiosInstance.get('/manager/revenue');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch revenue report');
    }
}
const getTopSellingProducts = async () => {
    try {
        const response = await axiosInstance.get('/manager/top-selling-products');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch top selling products');
    }
}
const getPromotionEffectiveness = async () => {
    try {
        const response = await axiosInstance.get('/manager/promotion-effectiveness');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch promotion effectiveness');
    }
}
const updateProduct = async (product) => {
    try {
        const response = await axiosInstance.put('/manager/products/update', product);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update product');
    }
}
const addProduct = async (product) => {
    try {
        const response = await axiosInstance.post('/manager/products/add', product);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to add product');
    }
}
export default { getAllUsers, getOrders, updateOrderStatus, getRevenueReport, getTopSellingProducts, getPromotionEffectiveness, updateProduct, addProduct };