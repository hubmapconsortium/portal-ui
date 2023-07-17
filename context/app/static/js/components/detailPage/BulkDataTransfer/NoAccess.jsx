import React from 'react';

import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import { StyledWarningIcon, WarningIconContainer, NoAccessContainer } from './style';

function NoAccess({ children }) {
  return (
    <DetailSectionPaper>
      <NoAccessContainer>
        <WarningIconContainer>
          <StyledWarningIcon />
        </WarningIconContainer>
        {children}
      </NoAccessContainer>
    </DetailSectionPaper>
  );
}

export default NoAccess;
