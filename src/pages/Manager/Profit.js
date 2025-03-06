import React, { useEffect, useState } from 'react';
import { getProfit } from '../../api/manager';
import ProfitChart from './component/profit/ProfitChart';
import './css/Profit.css';  // Đảm bảo bạn đã import file CSS
const Profit = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [profitData, setProfitData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData || userData.role !== 'manager') {
            window.location.href = '/smart3D/products';  // Redirect nếu không phải manager
        }
    }, []);
    useEffect(() => {
        if (startDate && endDate && category) {  // 🔥 Chỉ gọi API khi đủ dữ liệu
            handleGetProfit();
        }
    }, [page, startDate, endDate, category, limit]);

    const handleGetProfit = async () => {
        try {
            const { data, totalPages } = await getProfit({ startDate, endDate, category, page, limit });
            setTotalPages(totalPages);
            setProfitData(data);
            console.log(data,totalPages);
            console.log({ startDate, endDate, category, page, limit });
        } catch (error) {
            alert(error.message);
        }
    };
    return (
        <div className="profit-container">
            <h1>Doanh thu</h1>
            {/* Bộ lọc */}
            <div className="filter-section">
                {/* Chọn thời gian */}
                <input type="date" value={startDate} onChange={(e) => {setStartDate(e.target.value)
                        setPage(1);}}/>
                <input type="date" value={endDate} onChange={(e) => {setEndDate(e.target.value)
                    setPage(1);}} />

                {/* Chọn danh mục */}
                <select value={category} onChange={(e) => {
                    setCategory(e.target.value)
                              setPage(1);}
                }>
                    <option value="">Tất cả danh mục</option>
                    <option value="FDM 3D Printer">Máy in 3D FDM</option>
                    <option value="Resin 3D Printer">Máy in 3D Resin</option>
                    <option value="3D Printing Filament">Nhựa in</option>
                    <option value="3D Printer Accessories">Phụ kiện</option>
                </select>

                {/* Chọn số lượng trên trang */}
                <input
                    type="number"
                    value={limit}
                    onChange={(e) => {setLimit(Number(e.target.value))
                        setPage(1);}
                    }
                    placeholder="Số sản phẩm"
                />
        
            </div>

            {/* Biểu đồ */}
            <div className="chart-container">
                <ProfitChart data={profitData} />
            </div>

            {/* Phân trang */}
            <div className="pagination">
                <button onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1}>
                    ◀ Trang trước
                </button>
                <span>Trang {page} / {totalPages}</span>
                <button onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))} disabled={page >= totalPages}>
                    Trang sau ▶
                </button>
            </div>
        </div>
    );
};

export default Profit;
