import React, { useState,useEffect } from 'react';
import uploadFileInChunks from '../../components/3dprint/uploadHandler';

const Print3D = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);

  // Lấy thông tin user
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('userData')));
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return alert("Chưa chọn file hoặc chưa đăng nhập!");

    setUploading(true);
    try {
      await uploadFileInChunks(selectedFile, "1", "1", user.userId);
      alert("Tải lên thành công!");
    } catch (error) {
      alert("Lỗi khi tải lên: " + error.message);
    }
    setUploading(false);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Đang tải lên..." : "Upload STL"}
      </button>
    </div>
  );
};

export default Print3D;
