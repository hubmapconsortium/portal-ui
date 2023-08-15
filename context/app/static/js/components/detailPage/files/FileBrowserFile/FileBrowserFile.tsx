import React, { useMemo } from 'react';
import prettyBytes from 'pretty-bytes';
import { useAppContext } from 'js/components/Contexts';
import { getTokenParam } from 'js/helpers/functions';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { useDetailContext } from 'js/components/detailPage/DetailContext';
import FilesConditionalLink from '../FilesConditionalLink';
import PDFViewer from '../PDFViewer';
import { StyledRow, StyledFileIcon, IndentedDiv, FileSize, StyledInfoIcon, FileTypeChip } from './style';
import { useFilesContext } from '../Files/FilesContext';
import { DatasetFile } from '../types';

type FileBrowserFileProps = {
  fileObj: DatasetFile;
  depth: number;
};

function FileBrowserFile({ fileObj, depth }: FileBrowserFileProps) {
  const { hasAgreedToDUA, openDUA } = useFilesContext();
  const { uuid } = useDetailContext();
  const { assetsEndpoint, groupsToken } = useAppContext();

  const tokenParam = getTokenParam(groupsToken);

  const fileUrl = `${assetsEndpoint}/${uuid}/${fileObj.rel_path}${tokenParam}`;

  const chipLabel = useMemo(() => {
    const labels = [fileObj.is_qa_qc ? 'QA' : null, fileObj.is_data_product ? 'Data Product' : null];
    return labels.filter((label) => label !== null).join(' / ');
  }, [fileObj.is_qa_qc, fileObj.is_data_product]);

  // colSpan in FileBrowserDirectory should match the number of cells in the row.
  return (
    <StyledRow>
      <td>
        <IndentedDiv $depth={depth} data-testid="file-indented-div">
          <StyledFileIcon color="primary" />
          <FilesConditionalLink
            href={fileUrl}
            hasAgreedToDUA={hasAgreedToDUA}
            openDUA={() => openDUA(fileUrl)}
            variant="body1"
            download
          >
            {fileObj.file}
          </FilesConditionalLink>
          {fileObj.description && (
            <SecondaryBackgroundTooltip title={`${fileObj.description} (Format: ${fileObj.edam_term})`}>
              <StyledInfoIcon color="primary" />
            </SecondaryBackgroundTooltip>
          )}
        </IndentedDiv>
      </td>
      <td>{chipLabel ? <FileTypeChip label={chipLabel} variant="outlined" /> : null}</td>
      <td>{fileObj?.file.endsWith('.pdf') ? <PDFViewer pdfUrl={fileUrl} /> : null}</td>
      <td>
        <FileSize variant="body1">{prettyBytes(fileObj.size)}</FileSize>
      </td>
    </StyledRow>
  );
}

export default FileBrowserFile;
