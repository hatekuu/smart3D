import React, { useState,useRef } from 'react';
import { uploadStl } from '../../api/3dprint'; // Import API đã có
import './css/UploadFile.css'
const UploadFile = ({ user, printId }) => {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]); // Lưu danh sách file
  const [fileNames, setFileNames] = useState([]); // Lưu danh sách tên file
  const [quantities, setQuantities] = useState({}); // Lưu số lượng từng file
  const fileInputRef = useRef(null);
const handleAddFileClick = () => {
  if (fileInputRef.current) {
    fileInputRef.current.click();
  }
};
const handleFileChange = (e) => {
  const selectedFiles = Array.from(e.target.files);
  if (selectedFiles.length > 0) {
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    setFileNames((prevNames) => [...prevNames, ...selectedFiles.map((file) => file.name)]);

    // Cập nhật số lượng cho từng file mới, mặc định là 1
    setQuantities((prevQuantities) => {
      const newQuantities = { ...prevQuantities };
      selectedFiles.forEach((file) => {
        newQuantities[file.name] = 1;
      });
      return newQuantities;
    });
  }
};

  const handleQuantityChange = (fileName, value) => {
    const newQuantities = { ...quantities, [fileName]: value };
    setQuantities(newQuantities);
  };
  
  
  const generateFileId = () => {
    const timestamp = Date.now(); // Lấy thời gian hiện tại (milliseconds)
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase(); // 6 ký tự ngẫu nhiên
    return `${timestamp}-${randomStr}`;
  };
  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage('❌ Vui lòng chọn file trước khi upload.');
      return;
    }
  
    setUploading(true);
    setMessage('');
    const userId = user.userId;
  
    try {
      for (const file of files) {
        const fileId = generateFileId(); // Tạo fileId riêng cho từng file
        const quantity = quantities[file.name] || 1; // Lấy số lượng (mặc định là 1 nếu chưa có)
  
        await uploadStl(file, file.name, printId, userId, fileId, quantity);
      }
      setMessage(`✅ Tất cả file đã được tải lên thành công!`);
    } catch (error) {
      setMessage(`❌ Lỗi khi tải lên: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };
  
  
  
  return (
    <div className="upload-stl-container">
    <h2>📤 Upload Stl</h2>



          <div >
        <input type="file" multiple onChange={handleFileChange} />
      </div>

          <ul>
      {fileNames.map((name, index) => (
        <li key={index}>
          📄 {name}
          <input
            type="number"
            min="1"
            value={quantities[name] || 1}
            onChange={(e) => handleQuantityChange(name, Number(e.target.value))}
            style={{ width: "50px", marginLeft: "10px" }}
          />
        </li>
      ))}
    </ul>

    <div >
  <input
    type="file"
    ref={fileInputRef}
    onChange={handleFileChange}
    style={{ display: "none" }} // Ẩn input file
    multiple
  />
    <button  onClick={handleAddFileClick}>➕ Thêm file</button>


</div>


    <button  onClick={handleUpload} disabled={uploading}>
      {uploading ? '🚀 Đang tải lên...' : '🚀 Upload G-code'}
    </button>

    {message && <p >{message}</p>}
  </div>
  );
};

export default UploadFile;
