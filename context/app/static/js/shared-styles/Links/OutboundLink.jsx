import React from 'react';
import { trackEvent } from 'js/helpers/trackers';

import { LightBlueLink } from '.';

function sendOutboundEvent(event) {
  trackEvent({
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
