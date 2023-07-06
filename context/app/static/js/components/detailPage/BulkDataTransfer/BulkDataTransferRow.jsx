import React from 'react';
import InfoIcon from '@material-ui/icons/Info';

// import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { Header, ContentText, GreenCheckCircleIcon } from './style';

const statusIcons = {
  success: <GreenCheckCircleIcon fontSize="small" />,
  // error: <BlockIcon color="error" fontSize="small" />,
};

function BulkDataTransferRow({ title, status, tooltipText, children, addOns }) {
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
      {addOns}
    </DetailSectionPaper>
  );
}

export default BulkDataTransferRow;
