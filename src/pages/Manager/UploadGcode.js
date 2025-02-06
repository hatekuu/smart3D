import React, { useState } from 'react';
import { uploadFile } from '../../api/3dprint'; // Giả sử bạn có một API để upload file
import './css/UploadGcode.css';

const UploadGcode = () => {
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [printId, setPrintId] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file?.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setFileContent(content); // Lưu toàn bộ nội dung tệp mà không cắt bớt
    };
    if(file){
      reader.readAsText(file);
    }
 
  };

  const chunkFile = (fileContent) => {
    const chunkSize = 90 * 1024; // 90KB
    let chunks = [];
    let currentPosition = 0;
    let chunkIndex = 1;

    // Chia tệp thành các phần nhỏ không quá 90KB
    while (currentPosition < fileContent.length) {
      let chunk = fileContent.slice(currentPosition, currentPosition + chunkSize);
      chunks.push({ chunk, chunkIndex });
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

    // Chia tệp thành các phần nhỏ nếu tệp lớn hơn 90KB
    const fileChunks = chunkFile(fileContent);
    
    try {
      // Gửi từng phần một
      for (const { chunk, chunkIndex } of fileChunks) {
        await uploadFile(fileName, chunk, printId);
        console.log(`Đã gửi phần ${chunkIndex}`);
      }

      alert('Upload Gcode thành công!');
    } catch (err) {
      console.error(err);
      alert('Upload Gcode thất bại!');
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Gcode</h2>
      <input
        type="text"
        placeholder="Tên File"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
      />
      <input
        type="file"
        onChange={handleFileChange}
      />
      <input
        type="text"
        placeholder="ID In 3D Print"
        value={printId}
        onChange={(e) => setPrintId(e.target.value)}
      />
      <button onClick={handleUpload}>Upload Gcode</button>
   
    </div>
  );
};

export default UploadGcode;
