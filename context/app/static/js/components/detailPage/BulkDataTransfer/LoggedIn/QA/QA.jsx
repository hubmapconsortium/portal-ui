import React from 'react';

import EmailIconLink from 'js/shared-styles/Links/iconLinks/EmailIconLink';
import NoAccess from '../../NoAccess';
import { StyledContainer } from '../../style';

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
