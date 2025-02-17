import React, { useState, useEffect } from 'react';
import PrintList from './component/3dcontroll/3dprintList';
import { getPrinter, getFilePrint,updateStatus } from '../../api/3dprint';
import { Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PrintControll = () => {
  const [user, setUser] = useState(null);
  const [printers, setPrinters] = useState([]);
  const [files, setFiles] = useState([]); 
  const [printerId, setPrinterId] = useState('');
  const [processData, setProcessData]=useState({})
  const [job,setJob]=useState({})
  const [state,setState]= useState('')
  const [temp,setTemp]=useState({})
  const [tempHistory, setTempHistory] = useState([]); // Lưu lịch sử nhiệt độ
  const [timeLabels, setTimeLabels] = useState([]); // Lưu timestamp


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
      }, 1000); // Gọi lại mỗi 5 giây
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
          setTemp(result?.filedata?.tem_data[0]?.temperature.tool0)
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
              
              {processData &&(
                <div>
                  <p><strong>Trạng thái:</strong> {state}</p>
                  {processData?.completion != null && (
                  <p><strong>Tiến trình hiện tại:</strong> {(processData?.completion).toFixed(2)}%</p>
                         )}

                  <p><strong>Thời gian còn lại:</strong> {processData?.printTimeLeft ? formatTime(processData?.printTimeLeft) : "00:00:00"}</p>
                  <p><strong>Nhiệt độ đầu đùn mong muốn:</strong> {temp?.target }</p>
                  <p><strong>File đang in:</strong> {job?.file?.name }</p>
                 </div>
              )}
  {/* Biểu đồ nhiệt độ */}
  {tempHistory!=0&&(
      <div style={{ width: "800px", height: "500px" ,position:"relative",paddingBottom:"60px"}}>

      <h3>Biểu đồ nhiệt độ</h3>
      <Line
      data={{
        labels: timeLabels, // Nhãn thời gian
        datasets: [
          {
            label: "Nhiệt độ (°C)",
            data: tempHistory, // Dữ liệu nhiệt độ thực tế
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
          
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false, // Tắt tỷ lệ mặc định để có thể thay đổi chiều cao
        plugins: {
          datalabels: {
            display: true, // Hiển thị giá trị
            color: "black", // Màu chữ
            anchor: "end", // Vị trí hiển thị (start, center, end)
            align: "top", // Canh chỉnh chữ (top, bottom, center)
            font: {

              size: 12, // Kích thước chữ
            },
            formatter: (value) => `${value}°C`, // Định dạng hiển thị
          },
        },
        scales: {
      
          y: {
            min: 0,
            max: 250,
            ticks: {
              stepSize: 50,
              padding: 30, // Đẩy các giá trị trên trục Y ra xa trục

            },
          },
        },
      }}

      plugins={[ChartDataLabels]}
      />
</div>
  )}
      
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
