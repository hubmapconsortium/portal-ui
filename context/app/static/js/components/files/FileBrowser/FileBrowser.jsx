import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';

import useFilesStore from 'js/stores/useFilesStore';
import { relativeFilePathsToTree } from './utils';
import FileBrowserNode from '../FileBrowserNode';
import { ChipWrapper, ScrollTableBody, StyledTableContainer, HiddenTableHead } from './style';

const filesStoreSelector = (state) => ({
  displayOnlyQaQc: state.displayOnlyQaQc,
  toggleDisplayOnlyQaQc: state.toggleDisplayOnlyQaQc,
});

function FileBrowser(props) {
  const { files } = props;
  const [fileTree, setFileTree] = useState({});
  const [qaFileTree, setQaFileTree] = useState({});

  const { displayOnlyQaQc, toggleDisplayOnlyQaQc } = useFilesStore(filesStoreSelector);

  useEffect(() => {
    setFileTree(relativeFilePathsToTree(files));
    setQaFileTree(relativeFilePathsToTree(files.filter((file) => file?.is_qa_qc)));
  }, [files]);

  return (
    <StyledTableContainer component={Paper}>
      <ChipWrapper>
        <Chip
          label="Show QA Files Only"
          clickable
          color="primary"
          onClick={toggleDisplayOnlyQaQc}
          icon={<DoneIcon />}
          component="button"
          disabled={Object.keys(qaFileTree).length === 0}
        />
      </ChipWrapper>
      <Table data-testid="file-browser">
        <HiddenTableHead>
          <TableRow>
            <td>File</td>
            <td>Is QA</td>
            <td>Size</td>
          </TableRow>
        </HiddenTableHead>
        <ScrollTableBody>
          <FileBrowserNode fileSubTree={displayOnlyQaQc ? qaFileTree : fileTree} depth={0} />
        </ScrollTableBody>
      </Table>
    </StyledTableContainer>
  );
}

FileBrowser.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.exact({
      rel_path: PropTypes.string,
      edam_term: PropTypes.string,
      description: PropTypes.string,
      size: PropTypes.number,
      type: PropTypes.string,
    }),
  ).isRequired,
};

export default FileBrowser;
