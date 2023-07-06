import React from 'react';
import { trackLink } from 'js/helpers/trackers';
import { LightBlueLink } from 'js/shared-styles/Links';

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
    <LightBlueLink {...props} onClick={handleClick} rel="noopener noreferrer" target="_blank">
      {children}
    </LightBlueLink>
  );
}

export default OutboundLink;
export { sendOutboundEvent };
