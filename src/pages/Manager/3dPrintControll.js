import React, { useState, useEffect } from 'react';
import PrintList from './component/3dcontroll/3dprintList';
import { getPrinter, getFilePrint,updateStatus } from '../../api/3dprint';

const PrintControll = () => {
  const [user, setUser] = useState(null);
  const [printers, setPrinters] = useState([]);
  const [files, setFiles] = useState([]); 
  const [printerId, setPrinterId] = useState('');

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('userData') || '{}'));
    fetchData();
  }, []);

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

  const getFile = async (printerId) => {
    try {
      const result = await getFilePrint({ printId: printerId });
      console.log(result)
      if (result?.fileList) {
        setFiles(result.fileList);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const UpdateStatus= async(printerId,status)=>{
    try {
        const result = await updateStatus({ printId: printerId,status:status });
        console.log(result)
        alert("Đổi trạng thái thành công")
      } catch (error) {
        console.error(error);
      }
  }
  const selectedPrinter = printers.find((p) => p._id === printerId);

  return (
    <div>
      {!printerId && <PrintList printers={printers} setPrinterId={setPrinterId} getFile={getFile} />}
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
              <button className="reset-printer-button" onClick={() => UpdateStatus(printerId,"printing")}>Bắt đầu in</button>
              <button className="reset-printer-button" onClick={() => UpdateStatus(printerId,"writing_done")}>Dừng in</button>
              <button className="reset-printer-button" onClick={() => UpdateStatus(printerId,"writing")}>Bắt đầu lưu file</button>
            </div>
          </div>
        )}
         {files.length > 0 && (
            <div className="file-list">
              <h3>Danh sách file:</h3>
              <ul>
                {files.map((file, index) => (
                  <li key={index}>{file}</li>
                ))}
              </ul>
           
            </div>
          )}
      </div>
    </div>
  );
};

export default PrintControll;
