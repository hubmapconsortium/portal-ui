import React, { useState, useEffect, PropsWithChildren, KeyboardEvent } from 'react';
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';

import useFilesStore, { FilesStore } from 'js/stores/useFilesStore';
import { StyledTableRow, Directory, StyledFolderIcon, StyledFolderOpenIcon } from './style';

const filesStoreSelector = (state: FilesStore) => state.filesToDisplay;

type FileBrowserDirectoryProps = PropsWithChildren<{
  dirName: string;
  depth: number;
}>;

function FileBrowserDirectory({ dirName, children, depth }: FileBrowserDirectoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const onKeyDownHandler = (e: KeyboardEvent) => {
    if (e.keyCode === 13 /* carriage return */) {
      setIsExpanded(!isExpanded);
    }
  };

  const allFilesAreVisible = useFilesStore(filesStoreSelector) === 'all';

  useEffect(() => {
    setIsExpanded(!allFilesAreVisible);
  }, [allFilesAreVisible]);

  return (
    <>
      <StyledTableRow
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={onKeyDownHandler}
        role="button"
        tabIndex={0}
      >
        {/* colSpan should match the number of cells in a FileBrowserFile row. */}
        <td colSpan={4}>
          <Directory ml={(theme) => theme.spacing(4 * depth)}>
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

export default FileBrowserDirectory;
