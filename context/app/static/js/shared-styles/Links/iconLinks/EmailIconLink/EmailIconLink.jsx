import React from 'react';
import IconLink from 'js/shared-styles/Links/iconLinks/IconLink';
import { EmailIcon } from 'js/shared-styles/icons';
import { trackEvent } from 'js/helpers/trackers';

function sendEmailEvent(event) {
  trackEvent({
    category: 'Email Link',
    action: 'Clicked',
    label: event.target.href,
    nonInteraction: false,
  });
}

function EmailIconLink({ iconFontSize, email, ...rest }) {
  return (
    <IconLink
      href={`mailto:${email}`}
      onClick={sendEmailEvent}
      icon={<EmailIcon $fontSize={iconFontSize} />}
      {...rest}
    />
  );
}

export default EmailIconLink;
