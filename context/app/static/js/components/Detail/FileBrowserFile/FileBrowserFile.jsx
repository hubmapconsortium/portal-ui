import React, { useContext } from 'react';

import { readCookie } from 'helpers/functions';
import DatasetContext from '../Dataset/context';
import { StyledTypography, StyledFileIcon } from './style';

function FileBrowserFile(props) {
  const { fileObj, level } = props;
  const { assetsEndpoint, uuid } = useContext(DatasetContext);
  const token = readCookie('nexus_token');
  return (
    <StyledTypography
      href={`${assetsEndpoint}/${uuid}/${fileObj.fullPath}?token=${token}`}
      variant="body1"
      target="_blank"
      rel="noopener noreferrer"
      downloadvariant="body1"
      underline="none"
      $level={level}
    >
      <StyledFileIcon color="primary" />
      {fileObj.file}
    </StyledTypography>
  );
}

export default FileBrowserFile;
