import React from 'react';
import Typography from '@material-ui/core/Typography';
import BlockIcon from '@material-ui/icons/Block';
import InfoIcon from '@material-ui/icons/Info';

import EmailIconLink from 'js/shared-styles/Links/iconLinks/EmailIconLink';
import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import { Header, LoginButton } from './style';

function GlobusAccess() {
  return (
    <DetailSectionPaper>
      <Header variant="h5">
        HuBMAP Consortium Members: Globus Access
        <BlockIcon color="error" />
        <InfoIcon fontSize="small" />
      </Header>
      <Typography variant="body2">
        Please{' '}
        <a href="https://app.globus.org" target="_blank" rel="noopener noreferrer">
          log in
        </a>{' '}
        for Globus access or email
        <EmailIconLink variant="body2" email="help@hubmapconsortium.org">
          help@hubmapconsortium.org
        </EmailIconLink>{' '}
        with the dataset ID about the files you are trying to access.
      </Typography>
      <LoginButton href="https://app.globus.org" target="_blank" variant="contained" color="primary">
        Member Login
      </LoginButton>
    </DetailSectionPaper>
  );
}

export default GlobusAccess;
