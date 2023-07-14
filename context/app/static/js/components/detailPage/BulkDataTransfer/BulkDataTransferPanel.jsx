import React from 'react';
import InfoIcon from '@material-ui/icons/Info';

import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { Header, ContentText, GreenCheckCircleIcon, StyledBlockIcon } from './style';

const statusIcons = {
  success: <GreenCheckCircleIcon fontSize="small" />,
  error: <StyledBlockIcon color="error" fontSize="small" />,
};

function BulkDataTransferPanel({ title, status, tooltip, children, addOns }) {
  return (
    <DetailSectionPaper>
      <Header variant="h5">
        {title}
        {status ? statusIcons[status] : null}
        <SecondaryBackgroundTooltip title={tooltip}>
          <InfoIcon fontSize="small" />
        </SecondaryBackgroundTooltip>
      </Header>
      <ContentText variant="body2">{children}</ContentText>
      {addOns}
    </DetailSectionPaper>
  );
}

export default BulkDataTransferPanel;
