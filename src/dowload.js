const DownloadButton = ({ fileLink }) => {
    return (
      <a href={fileLink} download target="_blank" rel="noopener noreferrer">
        <button>Tải file STL</button>
      </a>
    );
  };
  
  // Sử dụng component
  <DownloadButton fileLink="https://drive.google.com/uc?export=download&id=FILE_ID" />;
  