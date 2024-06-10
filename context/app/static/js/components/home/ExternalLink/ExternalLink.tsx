import React from 'react';
import Typography from '@mui/material/Typography';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { Flex, ImageWrapper } from './style';

interface ExternalLinkProps {
  img: React.ReactNode;
  linkText: string;
  linkHref: string;
  description: string;
}

function ExternalLink({ img, linkText, linkHref, description }: ExternalLinkProps) {
  return (
    <Flex>
      <ImageWrapper>{img}</ImageWrapper>
      <div>
        <OutboundIconLink href={linkHref} variant="subtitle1">
          {linkText}
        </OutboundIconLink>
        <Typography variant="body2">{description}</Typography>
      </div>
    </Flex>
  );
}

export default ExternalLink;
