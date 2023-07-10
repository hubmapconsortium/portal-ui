import React from 'react';

import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import EmailIconLink from 'js/shared-styles/Links/iconLinks/EmailIconLink';
import { StyledWarningIcon, WarningIconContainer, NoAccessContainer } from './style';

function NoAccess() {
  return (
    <DetailSectionPaper>
      {/* <ContentText variant="body2"> */}
      <NoAccessContainer>
        <WarningIconContainer>
          <StyledWarningIcon />
        </WarningIconContainer>
        <div>
          This dataset contains protected-access human sequence data. Please ask the PI of your HuBMAP award to email{' '}
          <EmailIconLink variant="body2" email="help@hubmapconsortium.org">
            help@hubmapconsortium.org
          </EmailIconLink>{' '}
          to get you access to protected HuBMAP data through Globus.
        </div>
      </NoAccessContainer>
    </DetailSectionPaper>
  );
}

export default NoAccess;
