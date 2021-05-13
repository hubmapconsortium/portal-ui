import React from 'react';
import ReactGA from 'react-ga';

import { LightBlueLink } from '.';

function sendOutboundEvent(event) {
  ReactGA.event({
    category: 'Outbound Link',
    action: 'Clicked',
    label: event.target.href,
    nonInteraction: false,
  });
}

function OutboundLink({ children, ...props }) {
  return (
    <LightBlueLink {...props} onClick={sendOutboundEvent} rel="noopener noreferrer" target="_blank">
      {children}
    </LightBlueLink>
  );
}

export default OutboundLink;
export { sendOutboundEvent };
