import React, { useMemo } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';

import HubmapDataFooter from 'js/components/detailPage/files/HubmapDataFooter';
import { useFlaskDataContext } from 'js/components/Contexts';
import useFilesStore, { FileDisplayOption, FilesStore } from 'js/stores/useFilesStore';
import SelectableChip from 'js/shared-styles/chips/SelectableChip';
import { relativeFilePathsToTree } from './utils';
import FileBrowserNode from '../FileBrowserNode';
import { ChipWrapper } from './style';
import { FileTree, UnprocessedFile } from '../types';

const filesStoreSelector = (state: FilesStore) => ({
  displayOnlyQaQc: state.filesToDisplay === 'qa/qc',
  displayOnlyDataProducts: state.filesToDisplay === 'data products',
  filesToDisplay: state.filesToDisplay,
  toggleDisplayOnlyQaQc: state.toggleDisplayOnlyQaQc,
  toggleDisplayOnlyDataProducts: state.toggleDisplayOnlyDataProducts,
});

interface FileBrowserProps {
  files: UnprocessedFile[];
}

function FileBrowser({ files }: FileBrowserProps) {
  const {
    displayOnlyQaQc,
    displayOnlyDataProducts,
    filesToDisplay,
    toggleDisplayOnlyQaQc,
    toggleDisplayOnlyDataProducts,
  } = useFilesStore(filesStoreSelector);
  const {
    entity: { entity_type },
  } = useFlaskDataContext();

  const fileTrees: Record<FileDisplayOption, FileTree> = useMemo(
    () => ({
      all: relativeFilePathsToTree(files),
      'qa/qc': relativeFilePathsToTree(files.filter((file) => file?.is_qa_qc)),
      'data products': relativeFilePathsToTree(files.filter((file) => file?.is_data_product)),
    }),
    [files],
  );

  return (
    <>
      <TableContainer sx={{ maxHeight: 600, overflowY: 'auto' }} component={Paper}>
        <ChipWrapper>
          <SelectableChip
            label="Show QA Files"
            onClick={toggleDisplayOnlyQaQc}
            isSelected={displayOnlyQaQc}
            disabled={Object.keys(fileTrees['qa/qc']).length === 0}
          />
          <SelectableChip
            label="Show Data Products Files"
            onClick={toggleDisplayOnlyDataProducts}
            isSelected={displayOnlyDataProducts}
            disabled={Object.keys(fileTrees['data products']).length === 0}
          />
        </ChipWrapper>
        <Table data-testid="file-browser">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell padding="none" colSpan={2}>
                Type
              </TableCell>
              <TableCell sx={{ pl: 1 }}>Size</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <FileBrowserNode fileSubTree={fileTrees[filesToDisplay]} depth={0} />
          </TableBody>
        </Table>
      </TableContainer>
      {['Dataset', 'Support'].includes(entity_type) && <HubmapDataFooter />}
    </>
  );
}

export default FileBrowser;
