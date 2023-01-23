import { useState } from 'react'
import React from 'react';

import './FormBox.css'
import ListOfFiles from "./ListOfFiles";
import InputBox from "./InputBox";
import { uploadFiles, safeAsync } from "./utils";
import { isImage, AreImages, orderFilesBySize } from "./shared-utils";


function FormBox() {
  const [selectedFiles, setSelectedFiles] = useState({});
  
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    console.log(selectedFiles);

    // check if files object is empty
    if (Object.keys(selectedFiles).length === 0) {
      alert("no files, where did you click?");
      return;
    }

    // make sure the files are images
    if (!AreImages(selectedFiles)) {
      alert("At least one file is not an image\nPlease select only images");
      return;
    }

   
    // if everyting is ok, order the files by size and upload them
    const orderedFiles = orderFilesBySize(selectedFiles);

    // upload the files
    // const [response, err] = await safeAsync(uploadFiles, 'uploadFiles function Failed', false)(orderedFiles);
    const [response, err] = await safeAsync(
      () => uploadFiles(orderedFiles),
      'uploadFiles function Failed',
      false);
      
    if (err) {
      console.error(err);
      alert("Some or all files failed to upload.\nCheck the console for more details.");
      return;
    } 

    document.body.style.backgroundImage = `url(${URL.createObjectURL(orderedFiles[0])})`;
    alert("All files uploaded successfully");
  }


  return (
    <form className="FormBox" onSubmit={onSubmitHandler}
      encType="multipart/form-data"
    >
      <InputBox
        setSelectedFiles={setSelectedFiles}
        selectedFiles={selectedFiles}  
      />
      <ListOfFiles selectedFiles={selectedFiles} />

      <button type="submit">Upload</button>
    </form>
  );
}

export default FormBox;