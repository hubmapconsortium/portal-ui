import React from 'react';
import InfoIcon from '@mui/icons-material/Info';

import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { Header, StyledWarningIcon, IconContainer, NoAccessContainer, StyledExclamationIcon } from './style';

const statusIcons = {
  warning: <StyledWarningIcon />,
  exclamation: <StyledExclamationIcon color="error" fontSize="small" />,
};

function NoAccess({ status, title, tooltip, children }) {
  return (
    <DetailSectionPaper>
      {status === 'exclamation' && (
        <Header variant="h5">
          {title}
          {status ? statusIcons[status] : null}
          <SecondaryBackgroundTooltip title={tooltip}>
            <InfoIcon fontSize="small" color="primary" />
          </SecondaryBackgroundTooltip>
        </Header>
      )}
      <NoAccessContainer>
        {status === 'warning' && <IconContainer>{statusIcons[status]}</IconContainer>}
        {children}
      </NoAccessContainer>
    </DetailSectionPaper>
  );
}

export default NoAccess;
