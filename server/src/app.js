import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import { isImage, AreImages, orderFilesBySize } from './shared-utils.js';
import { resBadRequestMsg, ERROR_MESSAGES, parseUploadEndpoint, checkUploadErrors } from "./utils.js";
// import { checkPrime } from 'crypto';
import cors from 'cors';
// import { upload } from './src/routes/upload.js';


// backend
// const multer = require('multer');

const app = express();
const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

// using cors to allow cross origin requests
app.use(cors());

// using express.json() to parse the body of the request to json
app.use(express.json());



// serving the files from the dist folder
app.use("/", express.static('dist'));

// Setting up multer to handle the file upload
let upload = multer() // keeping files in memory
let files = {};
// Setting up the endpoint for handling multiple file uploads with key 'file'.
app.post('/upload', upload.single('file'), async (req, res) => {
  // _file is the uploaded file
  // _index is the index of the file in the 'ordered' array of files to be uploaded
  // _totalFiles is the total number of files to be uploaded
  const [_file, _index, _totalFiles] = parseUploadEndpoint(req, res);

  const [_hasError, _errorMessages] = checkUploadErrors(_file, _index, _totalFiles);

  if (_hasError) {
    // Send a bad request response (400) to the client with the error message
    resBadRequestMsg(res, _errorMessages);

    // remove the files from the memory if there was an error
    Object.entries(files).forEach(([key, value]) => {
      delete files[key];
    });

    return;
  }
  
  // if everything is ok, save the file in the files object (key: index, value: file)
  files[_index] = _file;
  console.log(`Saved to memory file ${_index + 1} of ${_totalFiles}, name: ${_file.originalname}`);

  // if the file is not the last file to be uploaded, send a success response to the client
  if (!(Object.keys(files).length === _totalFiles)) {
    res.status(200).send({
      status: 'success',
      message: `File ${_index + 1} of ${_totalFiles} uploaded successfully to the server. Waiting for the other files...`
    });
    return;
  }


  // the files should be ordered by size, so that the largest file is the first file in the array
  // but we can't trust the client to send the files in the correct order, so we have to sort them
  // time complexity: O(n) best case (already ordered), O(nlogn) worst case

  const _tempFilesArray = [];
  Object.entries(files).forEach(([key, value]) => {
    _tempFilesArray[key] = value;
  });
  const _orderedFiles = orderFilesBySize(_tempFilesArray);
  
  // write the files to the disk and send a success response to the client
  _orderedFiles.map(async (file, index) => {
    await fs.writeFile(`./pictures/${index}.${file.originalname.split('.').pop()}`, file.buffer, (err) => {
      if (err) {
        console.log(err);
      }
      console.log(`File ${index + 1} of ${_totalFiles} saved to disk.`);
    });
  });

    // remove the files from the memory
  Object.entries(files).forEach(([key, value]) => {
    delete files[key];
  });

  res.status(200).send({
    status: 'success',
    message: `All files uploaded successfully to the server.`
  });
  
});




// // Set the endpoint for handling file uploads
// app.post('/upload', upload.single('file'), (req, res) => {
//   // Get the file from the request body
//   const file = req.file;

//   // Do something with the file here, such as saving it to a database or storing it on a file system

//   // Send a response to the client
//   res.send({
//     status: 'success',
//     data: file
//   });
// })