import React from 'react';
import EmailIconLink from 'js/shared-styles/Links/iconLinks/EmailIconLink';
import GlobusLink from '../../GlobusLink';
import GlobusAccess from '../../GlobusAccess';
import { StyledContainer } from '../../style';

function PublicData() {
  return (
    <StyledContainer>
      <GlobusAccess title="HuBMAP Globus Access" status="success" tooltipText="Global research data management system">
        Files are available through the Globus Research Data Management System. If you require additional help, email{' '}
        <EmailIconLink variant="body2" email="help@hubmapconsortium.org">
          help@hubmapconsortium.org
        </EmailIconLink>{' '}
        with the dataset ID and information about the files you are trying to access.
      </GlobusAccess>
      <GlobusLink />
    </StyledContainer>
  );
}

export default PublicData;
