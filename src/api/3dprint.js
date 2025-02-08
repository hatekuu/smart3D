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
export const uploadStlChunk = async (query)=>{
  try {
    const response= await axiosInstance.post('/3dprint/uploadStl',query)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get upload');
  }
}
export default { uploadFile ,getPrinter };