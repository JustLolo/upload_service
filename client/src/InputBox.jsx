import React from 'react';
import './InputBox.css';
// import { uploadFile, uploadFiles } from './utils';

function InputBox({setSelectedFiles, selectedFiles}) {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.target?.files ?? e.dataTransfer?.files ?? {};
    // check if files object is empty
    if (Object.keys(files).length === 0) {
      alert("no files, where did you click?");
      return;
    }

    setSelectedFiles(files);
    // console.log("FormBox.jsx", selectedFiles);
    
    // console.log(selectedFiles);

    // const { data } = e.dataTransfer;

    // Do something with the files here
    // console.log(files);

    // Create a FormData Object to store the file
    // const formData = new FormData();
    // formData.append('file', files[0]);

    // fetch('/upload', {
    //   method: 'POST',
    //   body: formData,
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log('Success:', data);
    //   }
    //   )
    //   .catch((error) => {
    //     console.error('Error:', error);
    //   });

    // // Reset the state of the dropzone
    // dropRef.current.style.border = '1px solid black';
  };

  const handleChange = handleDrop;

  return (
    <div className='InputBox'>
      <input
        type="file"
        name="file"
        id="file"
        // only images
        accept="image/*"
        multiple
        style={{display: 'none' }}
        onChange={handleChange}
      />
      <label htmlFor="file" className='fileLabel'
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <h2>drag and drop some files here </h2>
        <h4> or just click</h4>
      </label>
    </div>
  );
}

export default InputBox;