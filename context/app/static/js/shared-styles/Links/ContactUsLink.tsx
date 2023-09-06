import React, { ComponentProps, MouseEvent, PropsWithChildren } from 'react';
import { trackLink } from 'js/helpers/trackers';
import IconLink from './iconLinks/IconLink';
import { EmailIcon } from '../icons';

type ContactUsLinkProps = PropsWithChildren<Omit<ComponentProps<typeof IconLink>, 'isOutbound' | 'href'>> & {
  iconFontSize?: string;
};

const href = 'https://hubmapconsortium.org/contact-form/';
const defaultText = 'contact us';

function getHelpEvent() {
  trackLink(window.location.href, 'help_form');
}

function ContactUsLink({ iconFontSize, children, ...props }: ContactUsLinkProps) {
  return (
    <IconLink
      href={href}
      isOutbound
      iconOnLeft={false}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      icon={<EmailIcon $fontSize={iconFontSize} />}
      {...props}
      onClick={(e: MouseEvent) => {
        getHelpEvent();
        if ('onClick' in props) {
          props.onClick(e);
        }
      }}
    >
      {children ?? defaultText}
    </IconLink>
  );
}

export default ContactUsLink;
