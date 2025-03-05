import React, { useState } from 'react';
import PrinterForm from './PrinterForm';
import PrinterGrid from './PrinterGrid';
import { addPrinter, updatePrinter, deletePrinter } from '../../../../api/manager';
import './css/3dprintList.css';

const PrintList = ({ printers, setPrinterId, getFile }) => {
  const [printerData, setPrinterData] = useState({
    Name: '',
    Type: '',
    Filament: '',
    Color: '',
    Size: '',
    url: '',
    api: '',
    printInfo: {
      stepper_motors: {
        current: '',
        quantity: ''
      },
      hotend_power: '',
      power_supply: {
        voltage: '',
        current: ''
      },
      heated_bed_power: '',
      electricity_price: '',
      default_power: ''
    }
  });

  const [editingPrinterId, setEditingPrinterId] = useState(null);
  const [isAddNew, setIsAddNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const [errorMessage, setErrorMessage] = useState(''); // To store error messages

  // Basic validation function
  const validateForm = () => {
    if (!printerData.Name || !printerData.Type || !printerData.Filament) {
      setErrorMessage('Tên máy in, Loại và Filament là bắt buộc!');
      return false;
    }
    return true;
  };

  // Reset form data
  const resetForm = () => {
    setPrinterData({
      Name: '',
      Type: '',
      Filament: '',
      Color: '',
      Size: '',
      url: '',
      api: '',
      printInfo: {
        stepper_motors: {
          current: '',
          quantity: ''
        },
        hotend_power: '',
        power_supply: {
          voltage: '',
          current: ''
        },
        heated_bed_power: '',
        electricity_price: '',
        default_power: ''
      }
    });
    setErrorMessage('');
  };

  // Add new printer
  const handleAddPrinter = async () => {
    if (!validateForm()) return;
    try {
      setIsLoading(true);
      setIsAddNew(true);
      await addPrinter(printerData);
      alert('Thêm máy in thành công!');
      resetForm();
    } catch (error) {
      setErrorMessage(error.message || 'Có lỗi xảy ra khi thêm máy in.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update printer
  const handleUpdatePrinter = async () => {
    if (!editingPrinterId || !validateForm()) return;
    try {
      setIsLoading(true);
      setIsAddNew(false);
      await updatePrinter({ ...printerData, id: editingPrinterId });
      alert('Cập nhật máy in thành công!');
      resetForm();
      setEditingPrinterId(null);
    } catch (error) {
      setErrorMessage(error.message || 'Có lỗi xảy ra khi cập nhật máy in.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete printer
  const handleDelete = async (printerId) => {
    if (window.confirm('Bạn có chắc muốn xóa máy in này?')) {
      try {
        await deletePrinter(printerId);
        alert('Xóa máy in thành công!');
      } catch (error) {
        setErrorMessage(error.message || 'Có lỗi xảy ra khi xóa máy in.');
      }
    }
  };

  return (
    <div className="product-list-container printer">
      <h2>Quản lý máy in</h2>

      {/* Show error message if any */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Printer Form Component */}
      {(editingPrinterId || isAddNew) && (
      <PrinterForm
      printerData={printerData}
      setPrinterData={setPrinterData}
      isAddNew={isAddNew}
      isLoading={isLoading}
      handleAddPrinter={handleAddPrinter}
      handleUpdatePrinter={handleUpdatePrinter}
      resetForm={resetForm}
      setEditingPrinterId={setEditingPrinterId}
      setIsaddNew={setIsAddNew}
      errorMessage={errorMessage}
      editingPrinterId={editingPrinterId} // Pass editingPrinterId as a prop
    />
    
      )}

      {/* Add new printer button */}
      {!isAddNew && !editingPrinterId && (
        <button onClick={() => {
          setIsAddNew(true);
          setEditingPrinterId(null);
          resetForm();
        }}>
          Thêm máy in
        </button>
      )}

      {/* Printer List Component */}
      <PrinterGrid printers={printers} setPrinterId={setPrinterId} getFile={getFile} handleDelete={handleDelete} setEditingPrinterId={setEditingPrinterId} setPrinterData={setPrinterData} />
    </div>
  );
};

export default PrintList;
