import React, { useContext } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import prettyBytes from 'pretty-bytes';
import { readCookie } from 'js/helpers/functions';

import { useRoundedSecondaryTooltipStyles } from 'js/shared-styles/tooltips';
import FilesConditionalLink from '../FilesConditionalLink';
import { StyledDiv, StyledFileIcon, IndentedDiv, FileSize, StyledInfoIcon } from './style';
import DetailContext from '../context';
import FilesContext from '../Files/context';

function FileBrowserFile(props) {
  const { fileObj, depth } = props;
  const { hasAgreedToDUA, openDUA } = useContext(FilesContext);
  const { assetsEndpoint, uuid } = useContext(DetailContext);
  const token = readCookie('nexus_token');
  const classes = useRoundedSecondaryTooltipStyles();

  const fileUrl = `${assetsEndpoint}/${uuid}/${fileObj.rel_path}?token=${token}`;

  return (
    <StyledDiv>
      <IndentedDiv $depth={depth}>
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
        <Tooltip title={`${fileObj.description} (Format: ${fileObj.edam_term})`} classes={classes}>
          <StyledInfoIcon color="primary" />
        </Tooltip>
      </IndentedDiv>
    </StyledDiv>
  );
}

export default FileBrowserFile;
