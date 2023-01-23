// Description: Utility functions for the app.
// Usage: import { uploadFiles } from "./utils.js";
// Important!!!, the safeAsync function is used to wrap any async function
// that is prone to errors. This is to catch errors and log them to the console.
// Usage: export const uploadFile = safeAsync(unsafeUploadFile);
// This is to avoid having to write try-catch blocks in every async function.



/**
 *
 * @param {File[]|FileList|File} files - 'Array' of files to upload
 * gotten from e.target?.files or e.dataTransfer?.files, or a single file.-->
 * order the files by size before uploading them to reduce server load and improve user experience.
 * @returns {Promise<JSON>} - A promise that resolves to the response from the server in JSON format.
 */
export async function uploadFiles(files) {
  const _files = Array.from(files);

  // upload each file simultaneously and store the promises in an array
  const response = _files.map((file, index) => _uploadFile(file, index, _files.length));
  
  // wait for all the promises to resolve or reject before returning and saving the response
  const reponseJSON = await Promise.allSettled(response);  

  // show an alert to the user if any of the files failed to upload
  // fullfilled in this scenario doesn't mean there wasn't any error
  const failedUploads = reponseJSON.filter(res => res.status === 'rejected');
  console.log("Failed uploads: ", failedUploads);
  if (failedUploads.length > 0) {
    return Promise.reject([null, failedUploads]);
  }

  return [reponseJSON];
}

/**
 * 
 * @param {*} file - A file to upload gotten from e.target?.files[i] or e.dataTransfer?.files[i].
 * @param {*} index - The index of the file in the array of files to upload.
 * @param {*} totalFiles - Amount of files to upload in the array of files to upload.
 * @returns 
 */
function _uploadFile(file, index, totalFiles) {
  return safeAsync(
    () => _unsafeUploadFile(file, index, totalFiles),
    `fetch-upload-${file.name}`
    );
}

/**
 * 
 * @param {File} file - A file to upload gotten from e.target?.files[i] or e.dataTransfer?.files[i].
 * @param {number} index - The index of the file in the array of files to upload.
 * @param {number} totalFiles - Amount of files to upload in the array of files to upload.
 * @returns {Promise<JSON>} - A promise that resolves to the response from the server in JSON format.
 * 
 * @example
 * // Usage: export const uploadFile = safeAsync(unsafeUploadFile);
 * export const uploadFile = safeAsync(unsafeUploadFile)
 */
async function _unsafeUploadFile(file, index = undefined, totalFiles = undefined) {
  const _formData = new FormData();
  _formData.append("file", file);

  if (index !== undefined) {
    _formData.append("index", index);
  }

  if (totalFiles !== undefined) {
    _formData.append("totalFiles", totalFiles);
  }

  const response = await fetch(
    `${import.meta.env.DEV ? import.meta.env.VITE_ORIGIN : "" }/upload`, {
    method: "POST",
    headers: {
      // "Content-Type": "multipart/form-data"
    },
    body: _formData
  });

  if (!response.ok) {
    await Promise.reject(`Server responded with status code ${response.status}`);
  }

  const data = await response.json();
  return data;
}


/**
 * 
 * @param {function} asyncFunc - The async function to wrap, 
 * it should return a promise and should be called inside the wrapper function.
 * @param {string} origin - The origin of the error.
 * @param {boolean} chainError - Whether to chain the error or not.
 * @returns {Promise} - A promise that resolves to the response from the server.
 * @example 
 * safeAsync(() => asyncFunc(...args), "error-here", true )
 * 
 * 
 * 
 */
export function safeAsync(asyncFunc, origin = "anonymous", chainError = true ) {
  return asyncFunc().catch(err => {
    let _errorMessage = "";

    // if err is an array, it's coming from uploadFiles function or some higher level function
    if (Array.isArray(err)) {
      console.log("Error from uploadFiles: ", err);
      console.log("_errorMessage");
      _errorMessage = `${origin}:\n${err.map(e => e.reason[1]).join("\n")}`;

      // if chainError is true, reject the promise with the error      
      return chainError ? Promise.reject([null, _errorMessage]) : Promise.resolve([null, _errorMessage]);
    }

    // err is not an array, it's coming from the uploadFile function or any other function
    _errorMessage = err instanceof Error ? err.message : err;
    _errorMessage = `${origin}: ${_errorMessage}`;
    return chainError ? Promise.reject([null, _errorMessage]) : Promise.resolve([null, _errorMessage]);
  });
}


// export function catchErrors(asyncFunc, errorDescriptor = "anonymous") {
//   return function (...args) {
//     try {
//       return asyncFunc(...args);
//     } catch (err) {
//       let _returnError = err instanceof Error ? err : new Error(err);
//       _returnError.origin = errorDescriptor;
//       console.log(`>> Error from ${errorDescriptor} <<: ${_returnError.message}`);
//       // throw the error to be caught by the catch block in the calling function
//       throw _returnError;
//     }    
//   };
// }