import React, { useState } from 'react';
import { Directory, StyledFolderIcon, StyledFolderOpenIcon } from './style';

function FileBrowserDirectory(props) {
  const { dirName, children, level } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <Directory $level={level} onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? <StyledFolderOpenIcon color="primary" /> : <StyledFolderIcon color="primary" />}
        {dirName}
      </Directory>
      {isExpanded && children}
    </div>
  );
}

export default FileBrowserDirectory;
