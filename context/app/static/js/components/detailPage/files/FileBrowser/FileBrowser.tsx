import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import DoneIcon from '@mui/icons-material/Done';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import Chip from '@mui/material/Chip';

import HubmapDataFooter from 'js/components/detailPage/files/HubmapDataFooter';
import { useFlaskDataContext } from 'js/components/Contexts';
import useFilesStore, {FileDisplayOption, FilesStore} from 'js/stores/useFilesStore';
import { relativeFilePathsToTree } from './utils';
import FileBrowserNode from '../FileBrowserNode';
import { ChipWrapper, StyledTableContainer, HiddenTableHead } from './style';
import { DatasetFile } from '../types';

const filesStoreSelector = (state: FilesStore) => ({
  displayOnlyQaQc: state.filesToDisplay === 'qa/qc',
  displayOnlyDataProducts: state.filesToDisplay === 'data products',
  filesToDisplay: state.filesToDisplay,
  toggleDisplayOnlyQaQc: state.toggleDisplayOnlyQaQc,
  toggleDisplayOnlyDataProducts: state.toggleDisplayOnlyDataProducts,
});

type FileBrowserProps = {
  files: DatasetFile[];
}

function FileBrowser({ files }: FileBrowserProps) {
  const { displayOnlyQaQc, displayOnlyDataProducts, filesToDisplay, toggleDisplayOnlyQaQc } = useFilesStore(filesStoreSelector);
  const {
    entity: { entity_type },
  } = useFlaskDataContext();

  const fileTrees = useMemo(
    () => ({
      all: relativeFilePathsToTree(files),
      ['qa/qc']: relativeFilePathsToTree(files.filter((file) => file?.is_qa_qc)),
      'data products': relativeFilePathsToTree(files.filter((file) => file?.is_data_product)),
    } as Record<FileDisplayOption, DatasetFile[]>),
    [files],
  );

  return (
    <>
      <StyledTableContainer component={Paper}>
        <ChipWrapper>
          <Chip
            label="Show QA Files Only"
            clickable
            onClick={toggleDisplayOnlyQaQc}
            color={displayOnlyQaQc ? 'primary' : undefined}
            icon={displayOnlyQaQc ? <DoneIcon /> : undefined}
            component="button"
            disabled={Object.keys(fileTrees['qa/qc']).length === 0}
          />
          <Chip
            label="Show Data Products Files"
            clickable
            onClick={toggleDisplayOnlyQaQc}
            color={displayOnlyDataProducts ? 'primary' : undefined}
            icon={displayOnlyQaQc ? <DoneIcon /> : undefined}
            component="button"
            disabled={Object.keys(fileTrees['data products']).length === 0}
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
            <FileBrowserNode fileSubTree={fileTrees[filesToDisplay]} depth={0} />
          </TableBody>
        </Table>
      </StyledTableContainer>
      {['Dataset', 'Support'].includes(entity_type) && <HubmapDataFooter />}
    </>
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
