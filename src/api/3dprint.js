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

export default { uploadFile  };