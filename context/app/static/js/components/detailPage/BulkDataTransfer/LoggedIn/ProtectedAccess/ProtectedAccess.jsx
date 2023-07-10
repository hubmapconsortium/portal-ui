import React from 'react';
import EmailIconLink from 'js/shared-styles/Links/iconLinks/EmailIconLink';
import { StyledContainer } from '../../style';
import GlobusAccess from '../../GlobusAccess';
import GlobusLink from '../../GlobusLink';

function ProtectedAccess() {
  return (
    <StyledContainer>
      <GlobusAccess
        title="HuBMAP Consortium Members: Globus Access"
        status="success"
        tooltipText="Global research data management system"
        loginButton={false}
      >
        You are authorized to access protected-access human sequence data through the Globus Research Data Management
        System. Please review and follow all policies related to the use of these protected data. If you require
        additional help, email{' '}
        <EmailIconLink variant="body2" email="help@hubmapconsortium.org">
          help@hubmapconsortium.org
        </EmailIconLink>{' '}
        with the dataset ID and information about the files you are trying to access.
      </GlobusAccess>
      <GlobusLink />
    </StyledContainer>
  );
}

export default ProtectedAccess;
