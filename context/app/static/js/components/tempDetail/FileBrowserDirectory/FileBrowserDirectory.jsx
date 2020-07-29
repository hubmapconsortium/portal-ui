import React, { useState } from 'react';
import { Directory, StyledFolderIcon, StyledFolderOpenIcon } from './style';

function FileBrowserDirectory(props) {
  const { dirName, children, depth } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <Directory $depth={depth} onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? <StyledFolderOpenIcon color="primary" /> : <StyledFolderIcon color="primary" />}
        {dirName}
      </Directory>
      {isExpanded && children}
    </div>
  );
}

export default FileBrowserDirectory;
