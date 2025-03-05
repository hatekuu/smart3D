import axiosInstance from './axios';


const payment = async (query) => {
 console.log(query)
  try {
    const response = await axiosInstance.post('/payment/payment',query);
    
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Fail payment');
  }
};
const transactionStatus = async (query) => {
 
  try {
    const response = await axiosInstance.post('/payment/transactionStatus',query);
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Fail get transaction status');
  }
}

export {payment,transactionStatus};