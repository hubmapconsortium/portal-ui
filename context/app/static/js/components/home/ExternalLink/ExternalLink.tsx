import React from 'react';
import Typography from '@mui/material/Typography';
import { useEventCallback } from '@mui/material/utils';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { trackEvent } from 'js/helpers/trackers';
import { ExternalLinkContainer, ImageWrapper } from './style';

interface ExternalLinkProps {
  img: React.ReactNode;
  title: string;
  linkText: string;
  linkHref: string;
  description: string;
  icon?: React.ReactNode;
}

function ExternalLink({ img, title, linkText, linkHref, description, icon }: ExternalLinkProps) {
  const handleTrack = useEventCallback(() => {
    trackEvent({
      category: 'Homepage',
      action: title,
      label: linkHref,
    });
  });

  return (
    <ExternalLinkContainer alignItems="center" direction="row">
      <ImageWrapper justifyContent="center" flexShrink={0}>
        {icon ?? img}
      </ImageWrapper>
      <div>
        <OutboundIconLink onClick={handleTrack} href={linkHref} variant="subtitle1">
          {linkText}
        </OutboundIconLink>
        <Typography variant="body2">{description}</Typography>
      </div>
    </ExternalLinkContainer>
  );
}

export default ExternalLink;
