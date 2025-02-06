import React, { useState } from 'react';

const UploadGcode = () => {
  const [fileContent, setFileContent] = useState('');
  const [fileInfo, setFileInfo] = useState(null);
  const MAX_SIZE = 4* 1024 * 1024; // Giới hạn 1MB (1MB = 1 * 1024 * 1024 bytes)

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.name.endsWith('.gcode')) {
      const reader = new FileReader();
      const blob = file.slice(0, MAX_SIZE); // Cắt file chỉ lấy 1MB đầu tiên

      reader.onload = (event) => {
        setFileContent(event.target.result); // Lưu nội dung file
      };

      reader.readAsText(blob); // Đọc phần cắt của file

      setFileInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB',
        displayedSize: (Math.min(file.size, MAX_SIZE) / 1024).toFixed(2) + ' KB',
      });
    } else {
      alert('Vui lòng chọn file G-code hợp lệ (.gcode)');
      setFileContent('');
      setFileInfo(null);
    }
  };

  const handleCopy = () => {
    if (fileContent) {
      navigator.clipboard.writeText(fileContent)
        .then(() => alert('Đã copy 1MB dữ liệu thành công!'))
        .catch(() => alert('Lỗi khi copy dữ liệu.'));
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow-md w-96 mx-auto text-center">
      <h2 className="text-xl font-bold mb-4">Upload & Copy 1MB G-code</h2>
      
      <input type="file" accept=".gcode" onChange={handleFileChange} className="mb-2" />

      {fileInfo && (
        <div className="mt-4 text-left bg-gray-100 p-2 rounded-md shadow-sm">
          <p><strong>Tên file:</strong> {fileInfo.name}</p>
          <p><strong>Kích thước gốc:</strong> {fileInfo.size}</p>
          <p><strong>Đã hiển thị:</strong> {fileInfo.displayedSize}</p>
        </div>
      )}

      {fileContent && (
        <div>
          <button
            onClick={handleCopy}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            📋 Copy 1MB Dữ Liệu
          </button>

          <div className="mt-4 bg-black text-green-400 p-2 rounded-md shadow-inner h-64 overflow-auto text-sm">
            <pre>{fileContent}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadGcode;
