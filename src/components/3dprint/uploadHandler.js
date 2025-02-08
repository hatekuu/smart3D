import { uploadStlChunk } from '../../api/3dprint'; // Import API đã có

const uploadFileInChunks = async (file, fileId, printId, userId, quantity, onProgress, chunkSize = 50 * 1024) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async (event) => {
      const base64Data = event.target.result.split(',')[1];
      const totalChunks = Math.ceil(base64Data.length / chunkSize);

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const chunk = base64Data.slice(chunkIndex * chunkSize, (chunkIndex + 1) * chunkSize);

        const query = {
          chunk,
          chunkIndex,
          totalChunks,
          fileId,
          fileName: file.name,
          printId,
          userId,
          quantity // Truyền số lượng vào payload
        };

        try {
          const response = await uploadStlChunk(query);
          console.log(response.message);

          const progress = ((chunkIndex + 1) / totalChunks) * 100;
          onProgress(file.name, progress); // Cập nhật tiến trình upload
        } catch (error) {
          console.error(`Lỗi khi gửi chunk ${chunkIndex + 1}:`, error.message);
          return reject(error);
        }
      }

      resolve(`Upload ${file.name} thành công!`);
    };

    reader.onerror = (error) => {
      console.error("Lỗi đọc file:", error);
      reject(error);
    };
  });
};
export default uploadFileInChunks