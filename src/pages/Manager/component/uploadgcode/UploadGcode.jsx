import React, { useState } from 'react';
import { uploadFile } from '../../../../api/3dprint';
import { FaFileAlt } from 'react-icons/fa';
import '../../css/UploadGcode.css';

const UploadGcode = () => {
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [process, setProcess] = useState('not_yet');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file?.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileContent(event.target.result);
    };

    if (file) {
      reader.readAsText(file);
    }
  };

  const chunkFile = (fileContent) => {
    const chunkSize = 1 * 1024 * 1024; // 1mb
    let chunks = [];
    let currentPosition = 0;
    let chunkIndex = 1;
  
    while (currentPosition < fileContent.length) {
      let chunk = fileContent.slice(currentPosition, currentPosition + chunkSize);
      let isLast = currentPosition + chunkSize >= fileContent.length; // Kiểm tra nếu chunk này là cuối cùng
      chunks.push({ chunk, chunkIndex, isLast });
      currentPosition += chunkSize;
      chunkIndex++;
    }
  
    return chunks;
  };
  

  const handleUpload = async () => {
    if (!fileContent) {
      alert('Vui lòng chọn một tệp để tải lên');
      return;
    }

    const fileChunks = chunkFile(fileContent);

    try {
      for (const { chunk, chunkIndex,isLast } of fileChunks) {
        await uploadFile(fileName, chunk, process,isLast);
        console.log(`Đã gửi phần ${chunkIndex}`);
      }

      alert('Upload G-code thành công!');
    } catch (err) {
      console.error(err);
      alert('Upload G-code thất bại!');
    }
  };

  return (
    <div className="upload-container">
      <h2>📤 Upload G-code</h2>

      <div className="upload-input">
        <FaFileAlt className="upload-icon" />
        <input type="text" placeholder="Tên File" value={fileName} onChange={(e) => setFileName(e.target.value)} />
      </div>
      <div className="upload-input">
        <input type="file" onChange={handleFileChange} />
      </div>
      <label>
        Đã hoàn tất chuyển đổi?
        <select value={process} onChange={(e) => setProcess(e.target.value)}>
          <option value="done">đã hoàn thành</option>
          <option value="not_yet">chưa</option>
        </select>
      </label>
      <button className="upload-button" onClick={handleUpload}>🚀 Upload G-code</button>
    </div>
  );
};

export default UploadGcode;
