// import React, { useState } from 'react';
import './ListOfFiles.css';
import File from "./File";

function ListOfFiles({selectedFiles}) {
  return (
    <>
      {selectedFiles.length > 0 ? (
        <div className='ListOfFiles'>
          <h2><u>Selected File/s</u></h2>
          <ul> { 
            Object.entries(selectedFiles).map(([key, value]) => (
              <File key={key} file={value}/>
            ))
          } </ul>
        </div>
        ) : null}
    </>
  );
  
}

export default ListOfFiles;