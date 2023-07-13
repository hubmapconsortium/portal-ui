import React from 'react';
import PropTypes from 'prop-types';
import prettyBytes from 'pretty-bytes';
import { useAppContext } from 'js/components/Contexts';
import { getTokenParam } from 'js/helpers/functions';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { useDetailContext } from 'js/components/detailPage/context';
import FilesConditionalLink from '../FilesConditionalLink';
import PDFViewer from '../PDFViewer';
import { StyledRow, StyledFileIcon, IndentedDiv, FileSize, StyledInfoIcon, QaChip } from './style';
import { useFilesContext } from '../Files/context';

function FileBrowserFile({ fileObj, depth }) {
  const { hasAgreedToDUA, openDUA } = useFilesContext();
  const { uuid } = useDetailContext();
  const { assetsEndpoint, groupsToken } = useAppContext();

  const tokenParam = getTokenParam(groupsToken);

  const fileUrl = `${assetsEndpoint}/${uuid}/${fileObj.rel_path}${tokenParam}`;

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
      <td>{fileObj?.is_qa_qc ? <QaChip label="QA" variant="outlined" /> : null}</td>
      <td>{fileObj?.file.endsWith('.pdf') ? <PDFViewer pdfUrl={fileUrl} /> : null}</td>
      <td>
        <FileSize variant="body1">{prettyBytes(fileObj.size)}</FileSize>
      </td>
    </StyledRow>
  );
}

FileBrowserFile.propTypes = {
  fileObj: PropTypes.shape({
    rel_path: PropTypes.string.isRequired,
    file: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    edam_term: PropTypes.string.isRequired,
    is_qa_qc: PropTypes.bool,
  }).isRequired,
  depth: PropTypes.number.isRequired,
};

export default FileBrowserFile;
