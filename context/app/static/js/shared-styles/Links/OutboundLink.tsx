import React from 'react';
import { LinkProps } from '@mui/material/Link';

import { trackLink } from 'js/helpers/trackers';
import InternalLink from './InternalLink';

function sendOutboundEvent(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
  trackLink((event.target as HTMLAnchorElement).href);
}

function OutboundLink({ children, onClick, ...props }: LinkProps) {
  function handleClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    if (onClick) {
      onClick(event);
    }
    sendOutboundEvent(event);
  }
  return (
    <InternalLink {...props} onClick={handleClick} rel="noopener noreferrer" target="_blank">
      {children}
    </InternalLink>
  );
}

export default OutboundLink;
export { sendOutboundEvent };
