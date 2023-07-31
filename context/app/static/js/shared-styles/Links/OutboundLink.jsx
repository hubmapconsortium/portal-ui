import React from 'react';
import { trackLink } from 'js/helpers/trackers';
import { InternalLink } from './index';

function sendOutboundEvent(event) {
  trackLink(event.target.href);
}

function OutboundLink({ children, onClick, ...props }) {
  function handleClick(event) {
    if (onClick) {
      onClick();
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
