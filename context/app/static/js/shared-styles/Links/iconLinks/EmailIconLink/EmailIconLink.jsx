import React from 'react';
import IconLink from 'js/shared-styles/Links/iconLinks/IconLink';
import { EmailIcon } from 'js/shared-styles/icons';
import ReactGA from 'react-ga';

function sendEmailEvent(event) {
  ReactGA.event({
    category: 'Email Link',
    action: 'Clicked',
    label: event.target.href,
    nonInteraction: false,
  });
}

function EmailIconLink({ iconFontSize, href, ...rest }) {
  return (
    <IconLink href={`mailto:${href}`} onCLick={sendEmailEvent} icon={<EmailIcon fontSize={iconFontSize} />} {...rest} />
  );
}

export default EmailIconLink;
