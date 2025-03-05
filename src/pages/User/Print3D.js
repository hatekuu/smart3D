import React, { useState, useEffect } from 'react';
import { filterPrint } from '../../api/3dprint';
import Print3DList from '../../components/3dprint/3dprintList';
import UploadFile from '../../components/3dprint/uploadFile';
import './css/Print3D.css';

const Print3D = () => {
  const [user, setUser] = useState(null);
  const [printers, setPrinters] = useState([]);
  const [printerId, setPrinterId] = useState('');
  const [query, setQuery] = useState({
    Filament: '',
    Color: '',
    Size: '',
    type: '',
    sort: ''
  });

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('userData') || '{}'));
  }, []);

  // Gọi fetchData khi query thay đổi
  useEffect(() => {
    fetchData();
  }, [query]);

  const fetchData = async () => {
    try {
      const result = await filterPrint(query);
      if (result) {
        setPrinters(result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Hàm xử lý thay đổi bộ lọc
  const handleFilterChange = (e) => {
    setQuery((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const selectedPrinter = printers.find((p) => p._id === printerId);

  return (
    <div>
    
      {/* Danh sách máy in */}
      {!printerId && <>
        {/* Bộ lọc */}
        <div className="filter-container">
        <select name="Filament" value={query.Filament} onChange={handleFilterChange}>
          <option value="">Chọn vật liệu</option>
          <option value="PLA">PLA</option>
          <option value="ABS">ABS</option>
          <option value="PETG">PETG</option>
        </select>

        <select name="Color" value={query.Color} onChange={handleFilterChange}>
          <option value="">Chọn màu</option>
          <option value="Brown">Nâu</option>
          <option value="Black">Đen</option>
          <option value="White">Trắng</option>
        </select>

        <select name="Size" value={query.Size} onChange={handleFilterChange}>
          <option value="">Chọn kích thước</option>
          <option value="200x200x200">200x200x200</option>
          <option value="220x220x220">220x220x220</option>
          <option value="300x300x300">300x300x300</option>
        </select>

        <select name="type" value={query.type} onChange={handleFilterChange}>
          <option value="">Chọn kiểu sắp xếp</option>
          <option value="power">Công suất</option>
          <option value="file">Số lượng file</option>
        </select>

        <select name="sort" value={query.sort} onChange={handleFilterChange}>
          <option value="">Chọn thứ tự</option>
          <option value="high">Cao</option>
          <option value="low">Thấp</option>
        </select>
      </div>
      <Print3DList printers={printers} setPrinterId={setPrinterId} />
      </>}

      {/* Thông tin máy in đã chọn */}
      {printerId && selectedPrinter && (
        <div className="print3d-container">
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
        </div>
      )}
    </div>
  );
};

export default Print3D;
