import React from 'react';

import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { InfoIcon } from 'js/shared-styles/icons';
import { LinkContainer, StyledLink } from './style';

interface BulkDataTransferLinkProps {
  url: string;
  title?: string;
  description?: string;
  tooltip?: string;
  outboundLink?: string;
  onClick?: () => void;
}

function Link({ url, title, description, tooltip, outboundLink, onClick }: BulkDataTransferLinkProps) {
  return (
    <>
      <Divider />
      <LinkContainer>
        <StyledLink variant="subtitle2">
          {title && (
            <OutboundIconLink onClick={onClick} href={url}>
              {title}
            </OutboundIconLink>
          )}
          {tooltip && (
            <SecondaryBackgroundTooltip title={tooltip}>
              <InfoIcon />
            </SecondaryBackgroundTooltip>
          )}
        </StyledLink>
        {description && <Typography variant="body2">{description}</Typography>}
        {outboundLink && (
          <>
            &nbsp;Here is&nbsp;
            <OutboundIconLink href={outboundLink}>additional documentation</OutboundIconLink>.
          </>
        )}
      </LinkContainer>
    </>
  );
}
export default Link;
