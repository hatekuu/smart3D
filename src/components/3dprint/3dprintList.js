import React from 'react';

const Print3DList = ({ printers, setPrinterId }) => {
  return (
    <div className="product-list-container ">
      <div className="product-grid">
        {printers.map((printer) => (
          <div key={printer._id} className="product-card">
            <h3>{printer.Printer.Name}</h3>
            <p>Filament: {printer.Printer.Filament}</p>
            <p>Type: {printer.Printer.Type}</p>
            <p>Size: {printer.Printer.Size}</p>
            <p>Color: {printer.Printer.Color}</p>
            <button onClick={() => setPrinterId(printer._id)}>Chọn máy in</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Print3DList;
