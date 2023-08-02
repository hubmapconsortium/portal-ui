import React from 'react';

import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import { StyledWarningIcon, IconContainer, NoAccessContainer, StyledExclamationIcon } from './style';

const statusIcons = {
  warning: <StyledWarningIcon />,
  error: <StyledExclamationIcon color="error" fontSize="small" />,
};

function NoAccess({ children, status }) {
  return (
    <DetailSectionPaper>
      <NoAccessContainer>
        <IconContainer>{status ? statusIcons[status] : null}</IconContainer>
        {children}
      </NoAccessContainer>
    </DetailSectionPaper>
  );
}

export default NoAccess;
