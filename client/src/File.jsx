import React from 'react';
function File({file}) {
  return (
    <li className="file">
      {file.name} - {file.size} bytes
    </li>
  );
}

export default File;