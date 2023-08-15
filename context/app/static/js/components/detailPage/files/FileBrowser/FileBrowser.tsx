import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import DoneIcon from '@mui/icons-material/Done';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import Chip, { ChipProps } from '@mui/material/Chip';

import HubmapDataFooter from 'js/components/detailPage/files/HubmapDataFooter';
import { useFlaskDataContext } from 'js/components/Contexts';
import useFilesStore, { FileDisplayOption, FilesStore } from 'js/stores/useFilesStore';
import { TableCell, TableContainer, TableHead } from '@mui/material';
import { relativeFilePathsToTree } from './utils';
import FileBrowserNode from '../FileBrowserNode';
import { ChipWrapper } from './style';
import { DatasetFile, FileTree } from '../types';

const filesStoreSelector = (state: FilesStore) => ({
  displayOnlyQaQc: state.filesToDisplay === 'qa/qc',
  displayOnlyDataProducts: state.filesToDisplay === 'data products',
  filesToDisplay: state.filesToDisplay,
  toggleDisplayOnlyQaQc: state.toggleDisplayOnlyQaQc,
  toggleDisplayOnlyDataProducts: state.toggleDisplayOnlyDataProducts,
});

type FileBrowserProps = {
  files: DatasetFile[];
};

type FileControlChipProps = Pick<ChipProps<'button'>, 'label' | 'onClick' | 'disabled'> & {
  selected: boolean;
};

function ControlChip({ label, onClick, disabled, selected }: FileControlChipProps) {
  return (
    <Chip
      label={label}
      clickable
      onClick={onClick}
      component="button"
      disabled={disabled}
      color={selected ? 'primary' : undefined}
      icon={selected ? <DoneIcon /> : undefined}
      sx={{
        px: selected ? 0 : 1.5,
      }}
    />
  );
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
    () =>
      ({
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
          <ControlChip
            label="Show QA Files"
            onClick={toggleDisplayOnlyQaQc}
            selected={displayOnlyQaQc}
            disabled={Object.keys(fileTrees['qa/qc']).length === 0}
          />
          <ControlChip
            label="Show Data Products Files"
            onClick={toggleDisplayOnlyDataProducts}
            selected={displayOnlyDataProducts}
            disabled={Object.keys(fileTrees['data products']).length === 0}
          />
        </ChipWrapper>
        <Table data-testid="file-browser">
          <TableHead>
            <TableRow>
              <TableCell sx={{pl: 3}}>Name</TableCell>
              <TableCell padding="none" colSpan={2}>Type</TableCell>
              <TableCell sx={{pl: 1}}>Size</TableCell>
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
