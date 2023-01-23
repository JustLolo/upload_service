import { response } from "express";
import { isImage } from "./shared-utils.js";

export const ERROR_MESSAGES = Object.freeze({
  MISSING_FILE: 'File is missing',
  NOT_AN_IMAGE: 'File is not an image',
  USE_UI: 'index or totalFiles value is missing, or invalid, use the frontend to upload files',
  DEFAULT: 'You did something wrong :)',
});

/**
 * @description - Sends a bad request response to the client with the provided error message.
 * @param {response} res - Response object
 * @param {String|String[]} errorMsg - Error message to send to the client.
 * Use ERROR_MESSAGES to get the error message to send.
 * If no error message is provided, the default error message is sent.
 * 
 * @returns - Returns the error message sent to the client.
 */
export function resBadRequestMsg(res, errorMsg) {
  // check if errorMsg is an array
  if (Array.isArray(errorMsg)) {
    errorMsg = errorMsg.join(', ');
  }

  console.log(errorMsg)
  const _badRequestMsg = badRequestMsg(errorMsg);
  res.setHeader('Content-Type', 'application/json');
  res.status(_badRequestMsg.status);
  res.send(JSON.stringify(_badRequestMsg));

  return _badRequestMsg;
}

export function badRequestMsg(errorMsg) {
  return {
    status: 400,
    message: errorMsg ?? ERROR_MESSAGES.DEFAULT,
  };
}

export function parseUploadEndpoint(req, res) {
  const _file = req.file;
  const _index = isNaN(req.body?.['index']) ? -1 : parseInt(req.body?.['index']);
  const _totalFiles = isNaN(req.body?.['totalFiles']) ? -1 : parseInt(req.body?.['totalFiles']);

  return [_file, _index, _totalFiles];
}


export function checkUploadErrors(_file, _index, _totalFiles) {
  const _errorMessages = [];
  let _hasError = false;
  if (!_file) {
    _errorMessages.push(ERROR_MESSAGES.MISSING_FILE);
    _hasError = true;
  }

  if (!isImage(_file)) {
    console.log("is it an image: ", isImage(_file));
    console.log(_file);
    // console.log('Is it an image?: ', (_file.type?.toLowerCase() ?? _file.mimetype?.toLowerCase() ?? null).startsWith("image/"));
    console.log(_file.mimetype);
    console.log(_file.mimetype.startsWith("image/"));
    console.log(_file);
    _errorMessages.push(ERROR_MESSAGES.NOT_AN_IMAGE);
    _hasError = true;
  }

  if (_index === -1 || _totalFiles === -1) {
    _errorMessages.push(ERROR_MESSAGES.USE_UI);
    _hasError = true;
  }

  return [_hasError, _errorMessages];
}