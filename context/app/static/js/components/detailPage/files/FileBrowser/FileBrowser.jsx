import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import DoneIcon from '@mui/icons-material/Done';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import Chip from '@mui/material/Chip';

import useFilesStore from 'js/stores/useFilesStore';
import { relativeFilePathsToTree } from './utils';
import FileBrowserNode from '../FileBrowserNode';
import { ChipWrapper, StyledTableContainer, HiddenTableHead } from './style';

const filesStoreSelector = (state) => ({
  displayOnlyQaQc: state.displayOnlyQaQc,
  toggleDisplayOnlyQaQc: state.toggleDisplayOnlyQaQc,
});

function FileBrowser({ files }) {
  const { displayOnlyQaQc, toggleDisplayOnlyQaQc } = useFilesStore(filesStoreSelector);

  const fileTrees = useMemo(
    () => ({
      all: relativeFilePathsToTree(files),
      qa: relativeFilePathsToTree(files.filter((file) => file?.is_qa_qc)),
    }),
    [files],
  );

  return (
    <StyledTableContainer component={Paper}>
      <ChipWrapper>
        <Chip
          label="Show QA Files Only"
          clickable
          onClick={toggleDisplayOnlyQaQc}
          color={displayOnlyQaQc ? 'primary' : undefined}
          icon={displayOnlyQaQc ? <DoneIcon /> : undefined}
          component="button"
          disabled={Object.keys(fileTrees.qa).length === 0}
        />
      </ChipWrapper>
      <Table data-testid="file-browser">
        <HiddenTableHead>
          <TableRow>
            <td>Name</td>
            <td>Type</td>
            <td>Size</td>
          </TableRow>
        </HiddenTableHead>
        <TableBody>
          <FileBrowserNode fileSubTree={displayOnlyQaQc ? fileTrees.qa : fileTrees.all} depth={0} />
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}

FileBrowser.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      rel_path: PropTypes.string.isRequired,
      edam_term: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      size: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      is_qa_qc: PropTypes.bool,
    }),
  ).isRequired,
};

export default FileBrowser;
