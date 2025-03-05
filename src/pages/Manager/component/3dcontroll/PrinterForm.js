import React from 'react';
const PrinterForm = ({
  printerData,
  setPrinterData,
  isAddNew,
  isLoading,
  handleAddPrinter,
  handleUpdatePrinter,
  resetForm,
  setEditingPrinterId,
  setIsaddNew,
  errorMessage,
  editingPrinterId
}) => {
  return (
    <div className="printer-form">
      <div className="form-group">
        <label htmlFor="Name">Tên máy in:</label>
        <input
          type="text"
          id="Name"
          placeholder="Tên máy in"
          value={printerData.Name}
          onChange={(e) => setPrinterData({ ...printerData, Name: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="Type">Loại:</label>
        <input
          type="text"
          id="Type"
          placeholder="Loại"
          value={printerData.Type}
          onChange={(e) => setPrinterData({ ...printerData, Type: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="Filament">Filament:</label>
        <input
          type="text"
          id="Filament"
          placeholder="Filament"
          value={printerData.Filament}
          onChange={(e) => setPrinterData({ ...printerData, Filament: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="Color">Màu sắc:</label>
        <input
          type="text"
          id="Color"
          placeholder="Màu sắc"
          value={printerData.Color}
          onChange={(e) => setPrinterData({ ...printerData, Color: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="Size">Kích thước:</label>
        <input
          type="text"
          id="Size"
          placeholder="Kích thước"
          value={printerData.Size}
          onChange={(e) => setPrinterData({ ...printerData, Size: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="url">URL máy in:</label>
        <input
          type="text"
          id="url"
          placeholder="URL máy in"
          value={printerData.url}
          onChange={(e) => setPrinterData({ ...printerData, url: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="api">API Key:</label>
        <input
          type="text"
          id="api"
          placeholder="API Key"
          value={printerData.api}
          onChange={(e) => setPrinterData({ ...printerData, api: e.target.value })}
        />
      </div>

      {/* PrintInfo Fields */}
      <div className="form-group">
        <label htmlFor="stepper_motors_current">Dòng tối đa của động cơ bước:</label>
        <input
          type="number"
          id="stepper_motors_current"
 
          value={printerData.printInfo.stepper_motors.current}
          onChange={(e) =>
            setPrinterData({
              ...printerData,
              printInfo: {
                ...printerData.printInfo,
                stepper_motors: {
                  ...printerData.printInfo.stepper_motors,
                  current: e.target.value
                }
              }
            })
          }
        />
      </div>

      <div className="form-group">
        <label htmlFor="stepper_motors_quantity">Số lượng động cơ:</label>
        <input
          type="number"
          id="stepper_motors_quantity"
     
          value={printerData.printInfo.stepper_motors.quantity}
          onChange={(e) =>
            setPrinterData({
              ...printerData,
              printInfo: {
                ...printerData.printInfo,
                stepper_motors: {
                  ...printerData.printInfo.stepper_motors,
                  quantity: e.target.value
                }
              }
            })
          }
        />
      </div>

      <div className="form-group">
        <label htmlFor="hotend_power">Công xuất đầu nung:</label>
        <input
          type="number"
          id="hotend_power"

          value={printerData.printInfo.hotend_power}
          onChange={(e) =>
            setPrinterData({
              ...printerData,
              printInfo: {
                ...printerData.printInfo,
                hotend_power: e.target.value
              }
            })
          }
        />
      </div>

      <div className="form-group">
        <label htmlFor="power_supply_voltage">Điện áp nguồn:</label>
        <input
          type="number"
          id="power_supply_voltage"
      
          value={printerData.printInfo.power_supply.voltage}
          onChange={(e) =>
            setPrinterData({
              ...printerData,
              printInfo: {
                ...printerData.printInfo,
                power_supply: {
                  ...printerData.printInfo.power_supply,
                  voltage: e.target.value
                }
              }
            })
          }
        />
      </div>

      <div className="form-group">
        <label htmlFor="power_supply_current">Dòng nguồn:</label>
        <input
          type="number"
          id="power_supply_current"
       
          value={printerData.printInfo.power_supply.current}
          onChange={(e) =>
            setPrinterData({
              ...printerData,
              printInfo: {
                ...printerData.printInfo,
                power_supply: {
                  ...printerData.printInfo.power_supply,
                  current: e.target.value
                }
              }
            })
          }
        />
      </div>

      <div className="form-group">
        <label htmlFor="heated_bed_power">Công suất của bàn nhiệt :</label>
        <input
          type="number"
          id="heated_bed_power"
  
          value={printerData.printInfo.heated_bed_power}
          onChange={(e) =>
            setPrinterData({
              ...printerData,
              printInfo: {
                ...printerData.printInfo,
                heated_bed_power: e.target.value
              }
            })
          }
        />
      </div>

      <div className="form-group">
        <label htmlFor="electricity_price">Giá tiền điện:</label>
        <input
          type="number"
          id="electricity_price"

          value={printerData.printInfo.electricity_price}
          onChange={(e) =>
            setPrinterData({
              ...printerData,
              printInfo: {
                ...printerData.printInfo,
                electricity_price: e.target.value
              }
            })
          }
        />
      </div>

      <div className="form-group">
        <label htmlFor="default_power">Công suất mạch điều khiển:</label>
        <input
          type="number"
          id="default_power"

          value={printerData.printInfo.default_power}
          onChange={(e) =>
            setPrinterData({
              ...printerData,
              printInfo: {
                ...printerData.printInfo,
                default_power: e.target.value
              }
            })
          }
        />
      </div>

      {/* Action Button */}
      <div className="action-buttons">
        {isAddNew || editingPrinterId ? (
          <button onClick={isAddNew ? handleAddPrinter : handleUpdatePrinter} disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : editingPrinterId ? 'Cập nhật máy in' : 'Thêm máy in'}
          </button>
        ) : null}

        {/* Cancel Button */}
        {(isAddNew || editingPrinterId) && (
          <button onClick={() => { resetForm(); setEditingPrinterId(null);setIsaddNew(null)}}>Hủy</button>
        )}
      </div>
    </div>
  );
};

export default PrinterForm;