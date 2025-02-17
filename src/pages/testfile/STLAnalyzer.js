import { useState } from "react";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

function STLAnalyzer() {
  const [result, setResult] = useState(null);

  const layerHeight = 0.4; // mm
  const printSpeed = 60; // mm/s
  const filamentDiameter = 1.75; // mm
  const filamentDensity = 1.25; // g/cm³ (PLA)

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log("📂 File được chọn:", file.name);

    const reader = new FileReader();
    reader.onload = function (e) {
      const loader = new STLLoader();
      const geometry = loader.parse(e.target.result);
      
      geometry.computeBoundingBox();
      const { min, max } = geometry.boundingBox;

      const totalHeight = max.z - min.z; // mm
      const totalLayers = totalHeight / layerHeight;

      // Giả sử tổng đường đi của đầu in khoảng 20000mm (phải lấy từ G-code)
      const printPathLength = 20000; // mm, cần lấy từ G-code thực tế

      // Tính thời gian in
      const printTime = printPathLength / printSpeed; // giây
      const printTimeMinutes = printTime / 60;

      // Tính lượng nhựa sử dụng
      const filamentUsed = printPathLength; // mm (giả định)
      const filamentVolume = Math.PI * Math.pow(filamentDiameter / 2, 2) * filamentUsed; // mm³
      const filamentWeight = (filamentVolume * filamentDensity) / 1000; // gram

      setResult({
        totalHeight,
        totalLayers,
        printTimeMinutes,
        filamentWeight,
      });

      console.log("📏 Kết quả:", {
        totalHeight,
        totalLayers,
        printTimeMinutes,
        filamentWeight,
      });
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <input type="file" accept=".stl" onChange={handleFileUpload} />
      {result && (
        <p>
          📏 **Chiều cao mô hình**: {result.totalHeight.toFixed(2)} mm <br />
          📜 **Số lớp in**: {result.totalLayers.toFixed(0)} lớp <br />
          ⏳ **Thời gian in**: {result.printTimeMinutes.toFixed(2)} phút <br />
          🎯 **Lượng nhựa dùng**: {result.filamentWeight.toFixed(2)} gram
        </p>
      )}
    </div>
  );
}

export default STLAnalyzer;
