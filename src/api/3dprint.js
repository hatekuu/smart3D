import axiosInstance from './axios';


// Get Single Product API
export const uploadFile = async (fileName,fileContent,printId) => {
  try {
    const response = await axiosInstance.post('/3dprint/uploadFile',{
        fileName,
        fileContent,
        printId
       
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

export const uploadStl  = async (file, fileName, printId, userId, fileId, quantity) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('printId', printId);
    formData.append('userId', userId);
    formData.append('fileId', fileId);
    formData.append('quantity', quantity);

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
    throw new Error(error.response?.data?.message || 'Failed to upload file');
  }
};

export const processGcodePricing = async (query)=>{
  try {
    const response= await axiosInstance.post('/3dprint/gcodepricing',query)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to query');
  }
}
export const confirmOrder = async (query)=>{
  try {
    const response= await axiosInstance.post('/3dprint/confirm-order',query)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to query');
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
export const confirmDonwload = async (query)=>{
  try {
    const response= await axiosInstance.post('/3dprint/confirm-download',query)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to query');
  }
}

export default { uploadFile ,getPrinter,confirmOrder,processGcodePricing,uploadStl  ,downloadStl,confirmDonwload};