import React from 'react';

const PrinterGrid = ({ printers, setPrinterId, getFile, handleDelete, setEditingPrinterId, setPrinterData }) => {
  return (
    <div className="product-grid">
      {printers.map((printer) => (
        <div key={printer._id} className="product-card">
          <h3>{printer.Printer.Name}</h3>
          <p>Filament: {printer.Printer.Filament}</p>
          <p>Type: {printer.Printer.Type}</p>
          <p>Size: {printer.Printer.Size}</p>
          <p>Color: {printer.Printer.Color}</p>
          <button
            onClick={() => {
              setPrinterId(printer._id);
              getFile(printer._id);
            }}
          >
            Chọn máy in
          </button>
          <button
            onClick={() => {
              setEditingPrinterId(printer._id);
              setPrinterData({ ...printer.Printer, url: printer.url, api: printer.api, printInfo: printer.printInfo });
            }}
          >
            Sửa
          </button>
          <button onClick={() => handleDelete(printer._id)}>Xóa</button>
        </div>
      ))}
    </div>
  );
};

export default PrinterGrid;
