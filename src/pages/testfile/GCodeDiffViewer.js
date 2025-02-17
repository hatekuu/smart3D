import React, { useState } from "react";

const GCodeDiffViewer = () => {
  const [file1Lines, setFile1Lines] = useState([]);
  const [file2Lines, setFile2Lines] = useState([]);
  const [differences, setDifferences] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isComparing, setIsComparing] = useState(false);

  const handleFileUpload = (event, setFileLines) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const lines = e.target.result.split("\n").map((line) => line.trim());
      setFileLines(lines);
    };
    reader.readAsText(file);
  };

  const compareFiles = () => {
    setDifferences([]);
    setProgress(0);
    setIsComparing(true);

    const maxLength = Math.max(file1Lines.length, file2Lines.length);
    const diffs = [];
    let i = 0;

    const processChunk = () => {
      const chunkSize = 1000; // So sánh từng phần 1000 dòng để tránh đơ
      const end = Math.min(i + chunkSize, maxLength);

      for (; i < end; i++) {
        if (file1Lines[i] !== file2Lines[i]) {
          diffs.push({
            line: i + 1,
            file1: file1Lines[i] || "",
            file2: file2Lines[i] || "",
          });
        }
      }

      setProgress(Math.floor((i / maxLength) * 100));

      if (i < maxLength) {
        setTimeout(processChunk, 0); // Tiếp tục xử lý phần tiếp theo mà không làm đơ UI
      } else {
        setDifferences(diffs);
        setIsComparing(false);
      }
    };

    processChunk();
  };
  
  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      
      <h2 className="text-xl font-bold mb-4">G-code Diff Viewer</h2>
      <div className="flex space-x-4 mb-4">
        <input type="file" onChange={(e) => handleFileUpload(e, setFile1Lines)} />
        <input type="file" onChange={(e) => handleFileUpload(e, setFile2Lines)} />
      </div>
      <button
        onClick={compareFiles}
        className={`px-4 py-2 rounded ${isComparing ? "bg-gray-500" : "bg-blue-500 text-white"}`}
        disabled={isComparing}
      >
        {isComparing ? "Đang so sánh..." : "So sánh"}
      </button>

      {/* Thanh tiến trình */}
      {isComparing && (
        <div className="mt-4 w-full bg-gray-300 rounded">
          <div
            className="bg-blue-500 text-white text-xs font-bold text-center p-1 rounded"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>
      )}

      {/* Hiển thị kết quả */}
      {differences.length > 0 && !isComparing && (
        <div className="mt-4 bg-white p-4 shadow rounded">
          <h3 className="text-lg font-semibold mb-2">Các dòng khác nhau:</h3>
          <ul className="list-disc pl-5">
            {differences.slice(0, 100).map((diff, index) => ( // Giới hạn hiển thị 100 dòng
              <li key={index} className="mb-2">
                <strong>Dòng {diff.line}:</strong>
                <div className="text-red-500">File 1: {diff.file1}</div>
                <div className="text-green-500">File 2: {diff.file2}</div>
              </li>
            ))}
          </ul>
          {differences.length > 100 && (
            <p className="text-gray-500 mt-2">Hiển thị 100 dòng đầu tiên...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GCodeDiffViewer;
