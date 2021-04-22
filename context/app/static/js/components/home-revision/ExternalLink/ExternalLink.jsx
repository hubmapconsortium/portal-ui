import React from 'react';
import Typography from '@material-ui/core/Typography';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import { Flex, StyledExternalIcon } from './style';

function ExternalLink({ linkText, linkHref, description }) {
  return (
    <Flex>
      <div>
        <OutboundLink href={linkHref} variant="subtitle1">
          {linkText} <StyledExternalIcon />
        </OutboundLink>
        <Typography>{description}</Typography>
      </div>
    </Flex>
  );
}

export default ExternalLink;
