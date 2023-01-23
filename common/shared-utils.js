/**
 * 
 * @param {File} file 
 * @returns {boolean} - Returns true if the file is an image, false otherwise.
 * 
 */
export function isImage(file) {
  console.log("test");
  return (file.type?.toLowerCase() ?? file.mimetype?.toLowerCase() ?? null).startsWith("image/")
  // return file.type?.startsWith('image/');
}

/**
 * 
 * @param {File[]|FileList|File} files - 'Array' of files to upload gotten from e.target?.files or e.dataTransfer?.files.
 * @returns {boolean} - Returns true if all of the files are images, false otherwise.
 * 
 */
export function AreImages(files) {
  const _files = Array.from(files);
  return !_files.some(file => !isImage(file));
}

/**
 * 
 * @param {File[]|FileList|File} files - 'Array' of files to upload gotten from e.target?.files or e.dataTransfer?.files.
 * @returns {File[]} - Returns an array of files sorted by size in descending order.
 */
export function orderFilesBySize(files) {
  const _files = Array.from(files);
  return _files.sort((a, b) => b.size - a.size);
}