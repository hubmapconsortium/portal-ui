import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import prettyBytes from 'pretty-bytes';

import { getTokenParamIfNexusTokenCookieExists } from 'js/helpers/functions';
import { SecondaryTooltip } from 'js/shared-styles/tooltips';
import DetailContext from 'js/components//Detail/context';
import FilesConditionalLink from '../FilesConditionalLink';
import { StyledDiv, StyledFileIcon, IndentedDiv, FileSize, StyledInfoIcon } from './style';
import FilesContext from '../Files/context';

function FileBrowserFile(props) {
  const { fileObj, depth } = props;
  const { hasAgreedToDUA, openDUA } = useContext(FilesContext);
  const { assetsEndpoint, uuid } = useContext(DetailContext);
  const tokenParam = getTokenParamIfNexusTokenCookieExists();

  const fileUrl = `${assetsEndpoint}/${uuid}/${fileObj.rel_path}${tokenParam}`;

  return (
    <StyledDiv>
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
        <FileSize variant="body1">{prettyBytes(fileObj.size)}</FileSize>
        <SecondaryTooltip title={`${fileObj.description} (Format: ${fileObj.edam_term})`}>
          <StyledInfoIcon color="primary" />
        </SecondaryTooltip>
      </IndentedDiv>
    </StyledDiv>
  );
}

FileBrowserFile.propTypes = {
  fileObj: PropTypes.shape({
    rel_path: PropTypes.string,
    file: PropTypes.string,
    size: PropTypes.number,
    description: PropTypes.string,
    edam_term: PropTypes.string,
  }).isRequired,
  depth: PropTypes.number.isRequired,
};

export default FileBrowserFile;
