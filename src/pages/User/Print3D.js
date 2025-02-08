import React, { useState, useEffect } from 'react';
import { getPrinter } from '../../api/3dprint';
import Print3DList from '../../components/3dprint/3dprintList';
import UploadFile from '../../components/3dprint/uploadFile'; // Đã đổi chữ in hoa

const Print3D = () => {
  const [user, setUser] = useState(null);
  const [printers, setPrinters] = useState([]);
  const [printerId, setPrinterId] = useState('');

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('userData')));

    const fetchData = async () => {
      try {
        const result = await getPrinter();
        
        if (result) {
          setPrinters(result);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Danh sách máy in 3D</h2>
      {!printerId && <Print3DList printers={printers} setPrinterId={setPrinterId} />}

      {printerId && <UploadFile printerId={printerId} user={user} />} {/* Đổi UploadFile đúng format */}
    </div>
  );
};

export default Print3D;
