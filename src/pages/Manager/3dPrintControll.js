import React, { useState, useEffect } from 'react';
import PrintList from './component/3dcontroll/3dprintList';
import { getFilePrint,updateStatus,sendCommand } from '../../api/3dprint';
import { getPrinter } from '../../api/manager';
import TempChart from './component/3dcontroll/chart';
import './css/printController.css'
const PrintControll = () => {
  const [user, setUser] = useState(null);
  const [printers, setPrinters] = useState([]);
  const [files, setFiles] = useState([]); 
  const [printerId, setPrinterId] = useState('');
  const [processData, setProcessData]=useState({})
  const [job,setJob]=useState({})
  const [state,setState]= useState('')
  const [command,setCommand]=useState('')
  const [tempHistory, setTempHistory] = useState([]); // Lưu lịch sử nhiệt độ
  const [timeLabels, setTimeLabels] = useState([]); // Lưu timestamp
  const [isLoading,setIsLoading]=useState(true)
  const [message,setMessage]=useState('')
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('userData') || '{}'));
    fetchData();
  }, []);
  useEffect(() => {
    let interval;
    if (printerId) {
      getFile(printerId); // Gọi ngay lần đầu
      interval = setInterval(() => {
        getFile(printerId);
      }, 3000); // Gọi lại mỗi 5 giây
    }
    return () => clearInterval(interval); // Dọn dẹp khi unmount hoặc printerId thay đổi
  }, [printerId]);
  
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
   
      if (result?.fileList) {
        setFiles(result.fileList);
      }
      if(result?.filedata)
      {
        setState(result.filedata.printData.state)
     
        setProcessData(result.filedata.printData.progress)
        setJob(result.filedata.printData.job)
        if(result?.filedata?.tem_data?.length>0){
        const currentTemp = result.filedata.tem_data?.[0]?.temperature?.tool0?.actual || 0;
        // Cập nhật lịch sử nhiệt độ
        setTempHistory((prev) => [...prev.slice(-5), currentTemp]); // Chỉ giữ 20 giá trị gần nhất
        setTimeLabels((prev) => [...prev.slice(-5), new Date().toLocaleTimeString()]); // Thêm timestamp
      }
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
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600); // Tính giờ
    const minutes = Math.floor((seconds % 3600) / 60); // Tính phút
    const remainingSeconds = seconds % 60; // Tính giây
  
    // Trả về định dạng "giờ:phút:giây"
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  // const SendCommand = async(event,printId)=>{
   
  //   if(event.key==="Enter"){
  //     console.log({key:event.key,printId,command})
  //     setIsLoading(true)
  //     setMessage("Đang gửi lệnh...")
  //   try {
  //     await sendCommand({command,printId})
  //   } catch (error) {
  //    console.log(error) 
  //   }
  //   setIsLoading(false)
  //     setMessage("")
  // }
  // }
  const handleMove = (axis, value) => {
    // Kiểm tra giá trị trục và giá trị di chuyển hợp lệ
    const validValue = value >= -250 && value <= 250;  // Điều chỉnh nếu cần giới hạn giá trị
    if (validValue) {
      const newCommand = `G1 ${axis}${value}`;
      Moving(printerId, newCommand); // Gọi hàm Moving với command mới
    } else {
      console.error("Giá trị di chuyển không hợp lệ!");
    }
  };
  
  const Moving = async (printId, command) => {
    setIsLoading(true);
    setMessage("Đang gửi lệnh...");
    try {
      await sendCommand({ command, printId });
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
    setMessage("");
  };
  

  
  return (
    <div>
    {!printerId && <PrintList printers={printers} setPrinterId={setPrinterId} getFile={getFile} />}
    {printerId && selectedPrinter && (
          <div className="print-controll-container">
        
          
      
            <h3>Máy In đã chọn</h3>
            {isLoading && (
              <h4 className="loading-message">{message}</h4>
            )}

            <div className="printer-details">
              <p><strong>Tên:</strong> {selectedPrinter?.Printer.Name}</p>
              <p><strong>Id:</strong> {selectedPrinter?._id}</p>
              <p><strong>Khổ in:</strong> {selectedPrinter?.Printer.Size}</p>
              <p><strong>Vật liệu:</strong> {selectedPrinter?.Printer.Filament}</p>
              <p><strong>Màu:</strong> {selectedPrinter?.Printer.Color}</p>
            </div>

            {processData && (
              <div className="print-status">
                <p><strong>Trạng thái:</strong> {state}</p>
                {processData?.completion != null && (
                  <p><strong>Tiến trình hiện tại:</strong> {(processData?.completion).toFixed(2)}%</p>
                )}
                
                {/* <label>
                  Nhiệt độ mong muốn:
                  <input
                    type="number"
                    value={command.replace("M104 S", "")}
                    onChange={(e) => {
                      let value = parseInt(e.target.value, 10) || 0;
                      if (value < 0) value = 0;
                      if (value > 250) value = 250;
                      setCommand(`M104 S${value}`);
                    }}
                    onKeyDown={(e) => SendCommand(e, printerId)}
                  />
                </label> */}

                <p><strong>Thời gian còn lại:</strong> {processData?.printTimeLeft ? formatTime(processData?.printTimeLeft) : "00:00:00"}</p>
                <p><strong>File đang in:</strong> {job?.file?.name}</p>
              </div>
            )}
            {files.length > 0 && (
                        <div className="file-list">
                          <h4>Danh sách file:</h4>
                          <ul>
                            {files.map((file, index) => (
                              <li key={index}>{file}</li>
                            ))}
                          </ul>
                        </div>
                      )}

            <div className="actions">
              <button className="button" onClick={() => setPrinterId('')}>🔄 Chọn lại máy in</button>
              <button className="button" onClick={() => UpdateStatus(printerId, "printing")}>Bắt đầu in</button>
              <button className="button" onClick={() => UpdateStatus(printerId, "writing_done")}>Dừng in</button>
              <button className="button" onClick={() => UpdateStatus(printerId, "writing")}>Bắt đầu lưu file</button>
            </div>

            {/* <div className="move-controls">
              <button className="move-button" onClick={() => handleMove("X", 10)}>+X</button>
              <button className="move-button" onClick={() => handleMove("X", -10)}>-X</button>
              <button className="move-button" onClick={() => handleMove("Y", 10)}>+Y</button>
              <button className="move-button" onClick={() => handleMove("Y", -10)}>-Y</button>
              <button className="move-button" onClick={() => handleMove("Z", 10)}>+Z</button>
              <button className="move-button" onClick={() => handleMove("Z", -10)}>-Z</button>
            </div> */}
            <div>
        </div>
            {tempHistory && (
              <TempChart tempHistory={tempHistory} timeLabels={timeLabels} />
            )}
            </div>
            )}
          </div>
  );
};

export default PrintControll;
