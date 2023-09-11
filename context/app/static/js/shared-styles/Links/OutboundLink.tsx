import React from 'react';
import { trackLink } from 'js/helpers/trackers';
import Link, { LinkProps } from '@mui/material/Link';

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
    <Link {...props} onClick={handleClick} rel="noopener noreferrer" target="_blank">
      {children}
    </Link>
  );
}

export default OutboundLink;
export { sendOutboundEvent };
