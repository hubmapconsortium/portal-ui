import React from 'react';
import Typography from '@mui/material/Typography';
import { useEventCallback } from '@mui/material/utils';

import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { trackEvent } from 'js/helpers/trackers';
import { ExternalLinkContainer, ImageWrapper } from './style';
import { InternalLink } from 'js/shared-styles/Links';

interface ExternalLinkProps {
  img: React.ReactNode;
  title: string;
  linkText: string;
  linkHref: string;
  description: string;
  icon?: React.ReactNode;
}

function HomepageRelatedLink({ img, title, linkText, linkHref, description, icon }: ExternalLinkProps) {
  const handleTrack = useEventCallback(() => {
    trackEvent({
      category: 'Homepage',
      action: title,
      label: linkHref,
    });
  });

  const isExternal = linkHref.startsWith('http');

  const LinkComponent = isExternal ? OutboundIconLink : InternalLink;

  return (
    <ExternalLinkContainer alignItems="center" direction="row">
      <ImageWrapper justifyContent="center" flexShrink={0}>
        {icon ?? img}
      </ImageWrapper>
      <div>
        <LinkComponent onClick={handleTrack} href={linkHref} variant="subtitle1">
          {linkText}
        </LinkComponent>
        <Typography variant="body2">{description}</Typography>
      </div>
    </ExternalLinkContainer>
  );
}

export default HomepageRelatedLink;
