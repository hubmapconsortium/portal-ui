import React from 'react';
import Typography from '@material-ui/core/Typography';
import BlockIcon from '@material-ui/icons/Block';
import InfoIcon from '@material-ui/icons/Info';

import { LightBlueLink } from 'js/shared-styles/Links';
import EmailIconLink from 'js/shared-styles/Links/iconLinks/EmailIconLink';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import { Header, LoginButton } from './style';

function GlobusAccess() {
  return (
    <DetailSectionPaper>
      <Header variant="h5">
        HuBMAP Consortium Members: Globus Access
        <BlockIcon color="error" fontSize="small" />
        <SecondaryBackgroundTooltip title="Global research data management system">
          <InfoIcon fontSize="small" />
        </SecondaryBackgroundTooltip>
      </Header>
      <Typography variant="body2">
        Please <LightBlueLink href="/login">log in</LightBlueLink> for Globus access or email{' '}
        <EmailIconLink variant="body2" email="help@hubmapconsortium.org">
          help@hubmapconsortium.org
        </EmailIconLink>{' '}
        with the dataset ID about the files you are trying to access.
      </Typography>
      <LoginButton href="/login">Member Login</LoginButton>
    </DetailSectionPaper>
  );
}

export default GlobusAccess;
