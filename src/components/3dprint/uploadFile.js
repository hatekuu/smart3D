import React, { useState } from 'react';
import uploadFileInChunks from './uploadHandler';

const UploadFile = ({ user, printerId }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [quantities, setQuantities] = useState({}); // Lưu số lượng của từng file

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);

    // Mặc định số lượng là 1 nếu chưa nhập
    const newQuantities = { ...quantities };
    files.forEach((file) => {
      if (!newQuantities[file.name]) {
        newQuantities[file.name] = 1;
      }
    });
    setQuantities(newQuantities);
  };

  const handleQuantityChange = (fileName, value) => {
    const num = Math.max(1, parseInt(value) || 1); // Đảm bảo số lượng >= 1
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [fileName]: num,
    }));
  };
  const handleUpload = async () => {
    if (!selectedFiles.length || !user) return alert("Chưa chọn file hoặc chưa đăng nhập!");
  
    // Tính tổng kích thước Base64 của tất cả file
    let totalBase64Size = selectedFiles.reduce((total, file) => {
      return total + (file.size * 4) / 3; // Chuyển sang kích thước Base64
    }, 0);
  
    if (totalBase64Size > 5 * 1024 * 1024) { // Giới hạn 5MB
      return alert("Tổng kích thước file vượt quá 5MB! Hãy chọn file nhỏ hơn.");
    }
  
    setUploading(true);
    const fileId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`; // Tạo fileId chung
  
    try {
      for (const file of selectedFiles) {
        await uploadFileInChunks(
          file,
          fileId,
          printerId,
          user.userId,
          quantities[file.name], // Truyền số lượng vào
          (fileName, progress) => {
            setUploadProgress((prevProgress) => ({
              ...prevProgress,
              [fileName]: progress.toFixed(2),
            }));
          }
        );
      }
      alert(`Tất cả file đã được tải lên thành công!`);
      setSelectedFiles([]); // Xóa danh sách sau khi upload thành công
      setUploadProgress({});
    } catch (error) {
      alert("Lỗi khi tải lên: " + error.message);
    }
  
    setUploading(false);
  };
  

  return (
    <div>
      <input type="file" multiple onChange={handleFileChange} />
      <ul>
        {selectedFiles.map((file, index) => (
          <li key={index}>
            {file.name} - {uploadProgress[file.name] ? `${uploadProgress[file.name]}%` : "Chưa tải lên"}
            <input
              type="number"
              min="1"
              value={quantities[file.name] || 1}
              onChange={(e) => handleQuantityChange(file.name, e.target.value)}
              style={{ marginLeft: "10px", width: "50px" }}
            />
          </li>
        ))}
      </ul>
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Đang tải lên..." : "Upload STL"}
      </button>
    </div>
  );
};

export default UploadFile;
