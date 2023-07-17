import React from 'react';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { InfoIcon } from 'js/shared-styles/icons';
import { LinkContainer, StyledLink } from './style';

function Link({ url, title, description, tooltip, outboundLink }) {
  return (
    <>
      <Divider />
      <LinkContainer>
        <StyledLink variant="subtitle2">
          <OutboundIconLink href={url}>{title}</OutboundIconLink>
          {tooltip && (
            <SecondaryBackgroundTooltip title={tooltip}>
              <InfoIcon />
            </SecondaryBackgroundTooltip>
          )}
        </StyledLink>
        <Typography variant="body2">{description}</Typography>
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
