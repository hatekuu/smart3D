import React from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const ProfitChart = ({ data }) => {
    const chartData = {
        labels: data.map((item) => item.name), // Tên sản phẩm
        datasets: [
            {
                label: "Doanh thu (VND)",
                data: data.map((item) => item.totalRevenue),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
                yAxisID: "y", // Gán vào trục Y chính
            },
            {
                label: "Giá nhập (VND)",
                data: data.map((item) => item.totalCost),
                backgroundColor: "rgba(255, 99, 132, 0.6)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
                yAxisID: "y", // Gán vào trục Y chính
            },
            {
                label: "Lợi nhuận (VND)",
                data: data.map((item) => item.profit),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                yAxisID: "y", // Gán vào trục Y chính
            },
            {
                label: "Số lượng bán",
                data: data.map((item) => item.totalQuantity),
                type: "line",
                borderColor: "rgba(255, 206, 86, 1)",
                backgroundColor: "rgba(255, 206, 86, 0.6)",
                borderWidth: 2,
                pointRadius: 5,
                yAxisID: "y1", // Gán vào trục Y phụ
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return value.toLocaleString() + " VND"; // Hiển thị đơn vị tiền
                    },
                },
            },
            y1: {
                beginAtZero: true,
                position: "right", // Trục Y phụ bên phải
                grid: {
                    drawOnChartArea: false, // Không vẽ lưới trên biểu đồ chính
                },
                ticks: {
                    stepSize: 1, // Số lượng bán là số nguyên
                },
            },
        },
        plugins: {
            legend: {
                position: "top",
            },
        },
    };

    return (
        <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Biểu đồ doanh thu, giá nhập, lợi nhuận & số lượng</h2>
            <div style={{ width: 800, height: 400 }}>
                <Bar data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default ProfitChart;
