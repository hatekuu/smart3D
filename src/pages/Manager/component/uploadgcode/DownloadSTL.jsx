import React, { useEffect, useState } from 'react';
import { downloadStl ,confirmDonwload} from '../../../../api/3dprint';
import '../../css/UploadGcode.css';

const DownloadSTL = () => {
  const [downloadedFiles, setDownloadedFiles] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await downloadStl();
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

  const getDownloadLink = (url) => {
    const fileId = url.split("/d/")[1]?.split("/")[0] || null;
    return fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : null;
  };

  const handleDownload = (url) => {
    const downloadUrl = getDownloadLink(url);
    if (downloadUrl) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("Không tìm thấy fileId!");
    }
  };

  return (
    <div className="downloadstl-container">
      <h3>📥 Các file đã tải xuống:</h3>
      {downloadedFiles.length === 0 ? (
        <p>Chưa có file nào.</p>
      ) : (
        <ul>
          {downloadedFiles.map((file, index) => (
            <li key={index}>
              <span>{file.fileName}</span>
              <button onClick={() => handleDownload(file.fileContent)}>
                📥 Tải xuống
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DownloadSTL;
