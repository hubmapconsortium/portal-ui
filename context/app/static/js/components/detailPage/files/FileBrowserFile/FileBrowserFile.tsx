import React, { useMemo } from 'react';

import prettyBytes from 'pretty-bytes';
import Box from '@mui/material/Box';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';

import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { useFilesContext } from '../FilesContext';
import FilesConditionalLink from '../../BulkDataTransfer/FilesConditionalLink';
import PDFViewer from '../PDFViewer';
import { StyledRow, StyledFileIcon, FileSize, StyledInfoIcon, FileTypeChip } from './style';
import { DatasetFile } from '../types';
import { useFileLink } from '../DataProducts/hooks';

interface FileBrowserFileProps {
  fileObj: DatasetFile;
  depth: number;
}

function FileBrowserFile({ fileObj, depth }: FileBrowserFileProps) {
  const { hasAgreedToDUA, openDUA } = useFilesContext();
  const trackEntityPageEvent = useTrackEntityPageEvent();
  const fileUrl = useFileLink(fileObj);

  const chipLabels = useMemo(() => {
    const labels = [fileObj.is_qa_qc ? 'QA' : null, fileObj.is_data_product ? 'Data Product' : null].filter(
      (l) => l !== null,
    ) as string[];
    return labels;
  }, [fileObj.is_qa_qc, fileObj.is_data_product]);

  // colSpan in FileBrowserDirectory should match the number of cells in the row.
  return (
    <StyledRow>
      <td>
        <Box
          sx={(theme) => ({
            padding: theme.spacing(1, 5),
            marginLeft: theme.spacing(depth * 4),
            display: 'flex',
            alignItems: 'center',
          })}
          data-testid="file-indented-div"
        >
          <StyledFileIcon color="primary" />
          <FilesConditionalLink
            href={fileUrl}
            hasAgreedToDUA={hasAgreedToDUA}
            openDUA={() => openDUA(fileUrl)}
            variant="body1"
            download
            fileName={fileObj.file}
            onClick={() =>
              trackEntityPageEvent({ action: 'File Browser / Download File Link', label: fileObj.rel_path })
            }
          />
          {fileObj.description && (
            <SecondaryBackgroundTooltip title={`${fileObj.description} (Format: ${fileObj.edam_term})`}>
              <StyledInfoIcon color="primary" />
            </SecondaryBackgroundTooltip>
          )}
        </Box>
      </td>
      <td>
        {chipLabels.map((fileType) => (
          <FileTypeChip key={fileType} label={fileType} variant="outlined" />
        ))}
      </td>
      <td>{fileObj?.file.endsWith('.pdf') ? <PDFViewer pdfUrl={fileUrl} /> : null}</td>
      <td>
        <FileSize variant="body1">{prettyBytes(fileObj.size)}</FileSize>
      </td>
    </StyledRow>
  );
}

export default FileBrowserFile;
