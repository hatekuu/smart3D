import React, { useState, useRef } from 'react';
import { uploadStl } from '../../api/3dprint'; // Import hàm API
import './css/UploadFile.css';

const UploadFile = ({ user, printId }) => {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [message, setMessage] = useState('');
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
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [fileName]: value,
    }));
  };

  const generateFileId = () => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
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
    const fileId = generateFileId();

    try {
      for (const file of files) {
        const chunkSize = 1 * 1024 * 1024; // 2MB mỗi chunk
        const totalChunks = Math.ceil(file.size / chunkSize);
    
        const quantity = quantities[file.name] || 1;
        let start = 0;

        for (let i = 0; i < totalChunks; i++) {
          const chunk = file.slice(start, start + chunkSize);
          start += chunkSize;

          const formData = new FormData();
          formData.append('file', chunk);
          formData.append('fileName', file.name);
          formData.append('chunkIndex', i);
          formData.append('totalChunks', totalChunks);
          formData.append('fileId', fileId);
          formData.append('quantity', quantity);
          formData.append('userId', userId);
          formData.append('printId', printId);

          console.log(`Uploading chunk ${i + 1}/${totalChunks}...`, {
            fileName: file.name,
            chunkIndex: i,
            totalChunks: totalChunks
          });

          try {
            await uploadStl(formData);
          } catch (error) {
            console.error('Error uploading chunk', error);
            return;
          }
        }
      }
      setMessage('✅ Tất cả file đã được tải lên thành công!');
      setFiles([]);
      setFileNames([]);
      setQuantities({});
    } catch (error) {
      setMessage(`❌ Lỗi khi tải lên: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-stl-container">
      <h2>📤 Upload STL</h2>

      <div>
        <input type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} ref={fileInputRef} />
        <button onClick={handleAddFileClick}>➕ Thêm file</button>
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
              style={{ width: '50px', marginLeft: '10px' }}
            />
          </li>
        ))}
      </ul>

      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? '🚀 Đang tải lên...' : '🚀 Upload G-code'}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadFile;
