import React from 'react';
import ReactGA from 'react-ga';

import { LightBlueLink } from '.';

function OutboundLink({ children, ...props }) {
  function sendOutboundEvent(event) {
    ReactGA.event({
      category: 'Outbound Link',
      action: 'Clicked',
      label: event.target.href,
      nonInteraction: false,
    });
  }
  return (
    <LightBlueLink {...props} onClick={sendOutboundEvent}>
      {children}
    </LightBlueLink>
  );
}

export default OutboundLink;
