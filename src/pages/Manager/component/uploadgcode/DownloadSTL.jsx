import React, { useEffect, useState } from 'react';
import { downloadStl, confirmDownload } from '../../../../api/3dprint';
import '../../css/UploadGcode.css';

const DownloadSTL = () => {
  const [downloadedFiles, setDownloadedFiles] = useState([]);
  const [id, setId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await downloadStl();
      setId(data._id);
      if (data.files && Array.isArray(data.files)) {
        const files = data.files.map(file => ({
          fileName: file.fileName,
          fileContent: file.fileContent,
        }));
        setDownloadedFiles(files);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = async (url, fileName) => {
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("Không tìm thấy file!");
      return;
    }

    try {
      await confirmDownload({ fileId: id, fileName });
      await fetchData(); // Chờ cập nhật dữ liệu xong rồi mới cập nhật UI
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="downloadstl-container">
      <h3>📥 Các file cần tải xuống:</h3>
      {downloadedFiles.length === 0 ? (
        <p>Chưa có file nào.</p>
      ) : (
        <ul>
          {downloadedFiles.map((file, index) =>
            file.fileContent ? (
              <li key={index}>
                <span>{file.fileName}</span>
                <button onClick={() => handleDownload(file.fileContent, file.fileName)}>
                  📥 Tải xuống
                </button>
              </li>
            ) : null
          )}
        </ul>
      )}
    </div>
  );
};

export default DownloadSTL;
