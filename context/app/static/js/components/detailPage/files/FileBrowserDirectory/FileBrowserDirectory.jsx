import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';

import useFilesStore from 'js/stores/useFilesStore';
import { StyledTableRow, Directory, StyledFolderIcon, StyledFolderOpenIcon } from './style';

const filesStoreSelector = (state) => state.filesToDisplay;

function FileBrowserDirectory({ dirName, children, depth }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const onKeyDownHandler = (e) => {
    if (e.keyCode === 13 /* carriage return */) {
      setIsExpanded(!isExpanded);
    }
  };

  const allFilesVisible = useFilesStore(filesStoreSelector) === 'all';

  useEffect(() => {
    setIsExpanded(!allFilesVisible);
  }, [allFilesVisible]);

  return (
    <>
      <StyledTableRow
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={onKeyDownHandler}
        role="button"
        tabIndex="0"
      >
        <td colSpan={4}>
          {/* colSpan should match the number of cells in a FileBrowserFile row. */}
          <Directory $depth={depth}>
            {isExpanded ? (
              <>
                <ArrowDropDownRoundedIcon color="secondary" />
                <StyledFolderOpenIcon color="primary" />
              </>
            ) : (
              <>
                <ArrowRightRoundedIcon color="secondary" />
                <StyledFolderIcon color="primary" />
              </>
            )}
            {dirName}
          </Directory>
        </td>
      </StyledTableRow>
      {isExpanded && children}
    </>
  );
}

FileBrowserDirectory.propTypes = {
  dirName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  depth: PropTypes.number.isRequired,
};

export default FileBrowserDirectory;
