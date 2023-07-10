import React from 'react';

import EmailIconLink from 'js/shared-styles/Links/iconLinks/EmailIconLink';
import { StyledContainer } from '../../style';
import NoAccess from '../../NoAccess';

function QA() {
  return (
    <StyledContainer>
      <NoAccess>
        <div>
          This dataset contains protected-access human sequence data. Please ask the PI of your HuBMAP award to email{' '}
          <EmailIconLink variant="body2" email="help@hubmapconsortium.org">
            help@hubmapconsortium.org
          </EmailIconLink>{' '}
          to get you access to protected HuBMAP data through Globus.
        </div>
      </NoAccess>
    </StyledContainer>
  );
}

export default QA;
