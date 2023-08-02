import React from 'react';
import Typography from '@mui/material/Typography';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import { Flex, StyledExternalIcon, ImageWrapper } from './style';

function ExternalLink({ img, linkText, linkHref, description }) {
  return (
    <Flex>
      <ImageWrapper>{img}</ImageWrapper>
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
