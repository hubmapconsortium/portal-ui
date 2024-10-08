import React from 'react';
import InfoIcon from '@mui/icons-material/Info';

import { DetailSectionPaper } from 'js/shared-styles/surfaces';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { Header, ContentText, GreenCheckCircleIcon, StyledBlockIcon } from './style';

const statusIcons = {
  success: <GreenCheckCircleIcon fontSize="small" />,
  error: <StyledBlockIcon color="error" fontSize="small" />,
} as const;

interface BulkDataTransferPanelProps {
  title: string;
  status?: 'success' | 'error';
  tooltip: string;
  children: React.ReactNode;
  addOns?: React.ReactNode;
}

function BulkDataTransferPanel({ title, status, tooltip, children, addOns }: BulkDataTransferPanelProps) {
  const statusIcon = status ? statusIcons[status] : null;
  return (
    <DetailSectionPaper>
      <Header variant="h5">
        {title}
        {status ? statusIcon : null}
        <SecondaryBackgroundTooltip title={tooltip}>
          <InfoIcon fontSize="small" color="primary" />
        </SecondaryBackgroundTooltip>
      </Header>
      <ContentText variant="body2">{children}</ContentText>
      {addOns}
    </DetailSectionPaper>
  );
}

export default BulkDataTransferPanel;
