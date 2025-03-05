import React, { useState, useEffect } from 'react';

import { Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


const TempChart = ({tempHistory,timeLabels}) => {
  return (
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
  )
}

export default TempChart