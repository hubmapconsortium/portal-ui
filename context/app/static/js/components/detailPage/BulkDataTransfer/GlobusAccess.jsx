import React from 'react';
import BlockIcon from '@material-ui/icons/Block';
import InfoIcon from '@material-ui/icons/Info';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import { Header, ContentText, LoginButton, GreenCheckCircleIcon } from './style';

const statusIcons = {
  success: <GreenCheckCircleIcon fontSize="small" />,
  error: <BlockIcon color="error" fontSize="small" />,
};

function GlobusAccess({ title, status, tooltipText, children, loginButton }) {
  return (
    <DetailSectionPaper>
      <Header variant="h5">
        {title}
        {status ? statusIcons[status] : null}
        <SecondaryBackgroundTooltip title={tooltipText}>
          <InfoIcon fontSize="small" />
        </SecondaryBackgroundTooltip>
      </Header>
      <ContentText variant="body2">{children}</ContentText>
      {loginButton && (
        <LoginButton href="/login" variant="contained" color="primary">
          Member Login
        </LoginButton>
      )}
    </DetailSectionPaper>
  );
}

export default GlobusAccess;
