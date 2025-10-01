import React from 'react';
import { EmailIcon } from 'js/shared-styles/icons';
import { trackLink } from 'js/helpers/trackers';
import IconLink, { IconLinkProps } from '../IconLink';

function sendEmailEvent(event: React.MouseEvent<HTMLAnchorElement>) {
  trackLink((event.target as HTMLAnchorElement).href, 'email');
}

interface EmailIconLinkProps extends Omit<IconLinkProps, 'icon'> {
  iconFontSize?: string;
  email: string;
}

function EmailIconLink({ iconFontSize, email, ...rest }: EmailIconLinkProps) {
  return (
    <IconLink
      {...rest}
      href={`mailto:${email}`}
      onClick={sendEmailEvent}
      icon={<EmailIcon sx={{ fontSize: iconFontSize }} />}
    />
  );
}

export default EmailIconLink;
