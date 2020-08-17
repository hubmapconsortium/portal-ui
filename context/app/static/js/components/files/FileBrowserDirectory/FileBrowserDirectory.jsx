import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Directory, StyledFolderIcon, StyledFolderOpenIcon } from './style';

function FileBrowserDirectory(props) {
  const { dirName, children, depth } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  const onKeyDownHandler = (e) => {
    if (e.keyCode === 13 /* carriage return */) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div>
      <Directory
        $depth={depth}
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={onKeyDownHandler}
        role="button"
        tabIndex="0"
      >
        {isExpanded ? <StyledFolderOpenIcon color="primary" /> : <StyledFolderIcon color="primary" />}
        {dirName}
      </Directory>
      {isExpanded && children}
    </div>
  );
}

FileBrowserDirectory.propTypes = {
  dirName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  depth: PropTypes.number.isRequired,
};

export default FileBrowserDirectory;
