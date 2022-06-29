import React from 'react';
import { trackLink } from 'js/helpers/trackers';

import { LightBlueLink } from '.';

function sendOutboundEvent(event) {
  trackLink(event.target.href);
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
