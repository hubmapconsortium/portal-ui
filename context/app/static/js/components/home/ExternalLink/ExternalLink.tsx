import React from 'react';
import Typography from '@mui/material/Typography';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { ExternalLinkContainer, ImageWrapper } from './style';

interface ExternalLinkProps {
  img: React.ReactNode;
  linkText: string;
  linkHref: string;
  description: string;
}

function ExternalLink({ img, linkText, linkHref, description }: ExternalLinkProps) {
  return (
    <ExternalLinkContainer alignItems="center" direction="row">
      <ImageWrapper justifyContent="center" flexShrink={0}>
        {img}
      </ImageWrapper>
      <div>
        <OutboundIconLink href={linkHref} variant="subtitle1">
          {linkText}
        </OutboundIconLink>
        <Typography variant="body2">{description}</Typography>
      </div>
    </ExternalLinkContainer>
  );
}

export default ExternalLink;
