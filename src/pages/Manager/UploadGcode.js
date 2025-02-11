import React from 'react';
import UploadGcode from './component/uploadgcode/UploadGcode';
import DownloadSTL from './component/uploadgcode/DownloadSTL';

const App = () => {
  return (
    <div className='upandown'>
      <UploadGcode />
      <DownloadSTL />
    </div>
  );
};

export default App;
