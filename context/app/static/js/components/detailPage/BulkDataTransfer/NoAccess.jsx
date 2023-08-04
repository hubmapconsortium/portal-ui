import React from 'react';
import InfoIcon from '@mui/icons-material/Info';

import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { Header, StyledWarningIcon, IconContainer, NoAccessContainer, StyledErrorIcon } from './style';

const statusIcons = {
  warning: <StyledWarningIcon />,
  error: <StyledErrorIcon color="error" fontSize="small" />,
};

function NoAccess({ status, children, title, tooltip }) {
  return (
    <DetailSectionPaper>
      {status === 'error' && (
        <Header variant="h5">
          {title}
          {statusIcons[status]}
          <SecondaryBackgroundTooltip title={tooltip}>
            <InfoIcon fontSize="small" color="primary" />
          </SecondaryBackgroundTooltip>
        </Header>
      )}
      <NoAccessContainer displayValue={status === 'error' ? 'block' : 'flex'}>
        {status === 'warning' && <IconContainer>{statusIcons[status]}</IconContainer>}
        {children}
      </NoAccessContainer>
    </DetailSectionPaper>
  );
}

export default NoAccess;
