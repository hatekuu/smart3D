import React, { useState, useEffect } from 'react';
import { getPrinter } from '../../api/3dprint';
import Print3DList from '../../components/3dprint/3dprintList';
import UploadFile from '../../components/3dprint/uploadFile';
import './css/Print3D.css'; // Import file CSS mới

const Print3D = () => {
  const [user, setUser] = useState(null);
  const [printers, setPrinters] = useState([]);
  const [printerId, setPrinterId] = useState('');
 
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('userData') || '{}'));

    const fetchData = async () => {
      try {
        const result = await getPrinter();
        if (result) {
          setPrinters(result);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const selectedPrinter = printers.find(p => p._id === printerId);

  return (
    <div >
      {!printerId && <Print3DList printers={printers} setPrinterId={setPrinterId} />}
      <div className="print3d-container">
      {printerId && selectedPrinter && (
        <div className="selected-printer">
          <h3>Máy In đã chọn</h3>
          <div className="printer-info">
            <p><strong>Tên:</strong> {selectedPrinter.Printer.Name}</p>
            <p><strong>Khổ in:</strong> {selectedPrinter.Printer.Size}</p>
            <p><strong>Vật liệu:</strong> {selectedPrinter.Printer.Filament}</p>
            <p><strong>Màu:</strong> {selectedPrinter.Printer.Color}</p>
            <button className="reset-printer-button" onClick={() => setPrinterId('')}>🔄 Chọn lại máy in</button>

          </div>
          <UploadFile printId={printerId} user={user} />
        </div>
      )}</div>
    </div>
  );
};

export default Print3D;
