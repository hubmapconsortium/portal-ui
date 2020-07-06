import React, { useContext } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import prettyBytes from 'pretty-bytes';
import { readCookie } from 'helpers/functions';

import { useRoundedSecondaryTooltipStyles } from 'shared-styles/Tooltips';
import ConditionalLink from './ConditionalLink';
import DatasetContext from '../Dataset/context';
import { StyledDiv, StyledFileIcon, IndentedDiv, FileSize, StyledInfoIcon } from './style';

function FileBrowserFile(props) {
  const { fileObj, depth, hasAgreedToDUA, agreeToDUA } = props;
  const { assetsEndpoint, uuid } = useContext(DatasetContext);
  const token = readCookie('nexus_token');
  const classes = useRoundedSecondaryTooltipStyles();
  return (
    <StyledDiv>
      <IndentedDiv $depth={depth}>
        <StyledFileIcon color="primary" />
        <ConditionalLink
          href={`${assetsEndpoint}/${uuid}/${fileObj.rel_path}?token=${token}`}
          hasAgreedToDUA={hasAgreedToDUA}
          agreeToDUA={agreeToDUA}
        >
          {fileObj.file}
        </ConditionalLink>
        <FileSize variant="body1">{prettyBytes(fileObj.size)}</FileSize>
        <Tooltip title={`${fileObj.description} (Format: ${fileObj.edam_term})`} classes={classes}>
          <StyledInfoIcon color="primary" />
        </Tooltip>
      </IndentedDiv>
    </StyledDiv>
  );
}

export default FileBrowserFile;
