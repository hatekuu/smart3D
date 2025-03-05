import axiosInstance from './axios';


// Get Single Product API
export const uploadFile = async (fileName,fileContent,process) => {
  try {
    const response = await axiosInstance.post('/3dprint/uploadFile',{
        fileName,
        fileContent,
        process
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to upload file');
  }
};
export const getPrinter = async ()=>{
  try {
    const response= await axiosInstance.post('/3dprint/getPrinter')
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get printer');
  }
}
export const filterPrint = async (query) => {
  try {
    const response = await axiosInstance.post('/3dprint/filterPrint',query);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get print');
  }
};
export const uploadStl  = async (formData) => {
  try {
   
    // Gửi formData lên backend
    const response = await axiosInstance.post('/3dprint/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Trả kết quả từ backend
    return response.data;
  } catch (error) {
    // Nếu có lỗi, ném lỗi và thông báo
    throw new Error(error.response?.data || 'Failed to upload file');
  }
};

export const processGcodePricing = async (query)=>{
  try {
    const response= await axiosInstance.post('/3dprint/gcodepricing',query)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data || 'Failed to query');
  }
}
export const confirmOrder = async (query)=>{
  console.log(query)
  try {
    const response= await axiosInstance.post('/3dprint/confirm-order',query)
    return response.data
  } catch (error) {
    console.log(error.data)
  }
}
export const downloadStl = async (query)=>{
  try {
    const response= await axiosInstance.post('/3dprint/download-stl',query)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to query');
  }
}
export const confirmDownload = async (query)=>{
  try {
    const response= await axiosInstance.post('/3dprint/confirm-download',query)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to query');
  }
}
export const updateStatus = async (query)=>{
  try {
    const response= await axiosInstance.post('/3dprint/updateStatus',query)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to query');
  }
}
export const getFilePrint = async (query)=>{
  try {
    const response= await axiosInstance.post('/3dprint/getFile',query)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to query');
  }
}
export const sendCommand = async (query)=>{
  console.log(query)
  try {
    const response= await axiosInstance.post('/3dprint/sendCommand',query)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to query');
  }
}
export default {filterPrint,uploadFile ,getPrinter,confirmOrder,processGcodePricing,uploadStl  ,downloadStl,confirmDownload,updateStatus,sendCommand};