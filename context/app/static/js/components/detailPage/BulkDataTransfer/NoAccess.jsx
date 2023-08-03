import React from 'react';

import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import { StyledWarningIcon, IconContainer, NoAccessContainer, StyledExclamationIcon } from './style';

const statusIcons = {
  warning: <StyledWarningIcon />,
  exclamation: <StyledExclamationIcon color="error" fontSize="small" />,
};

function NoAccess({ status, children }) {
  return (
    <DetailSectionPaper>
      <NoAccessContainer>
        {status === 'warning' && <IconContainer>{statusIcons[status]}</IconContainer>}
        {children}
      </NoAccessContainer>
    </DetailSectionPaper>
  );
}

export default NoAccess;
