import React from 'react';
import IconLink from 'js/shared-styles/Links/iconLinks/IconLink';
import { EmailIcon } from 'js/shared-styles/icons';
import { trackLink } from 'js/helpers/trackers';

function sendEmailEvent(event) {
  trackLink(event.target.href, 'email');
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
