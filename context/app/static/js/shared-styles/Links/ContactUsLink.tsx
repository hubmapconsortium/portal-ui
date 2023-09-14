import React, { ComponentProps, MouseEvent, PropsWithChildren } from 'react';
import { trackLink } from 'js/helpers/trackers';
import IconLink from './iconLinks/IconLink';
import { SupportIcon } from '../icons';

type OmittedIconLinkProps = Omit<ComponentProps<typeof IconLink>, 'isOutbound' | 'href' | 'onClick'>;

interface ContactUsLinkProps extends PropsWithChildren<OmittedIconLinkProps> {
  iconFontSize?: string;
  onClick?: (e: MouseEvent) => void;
}

const href = 'https://hubmapconsortium.org/contact-form/';
const defaultText = 'contact us';

function getHelpEvent() {
  trackLink(window.location.href, 'help_form');
}

function ContactUsLink({ iconFontSize, children, onClick, ...props }: ContactUsLinkProps) {
  return (
    <IconLink
      href={href}
      isOutbound
      iconOnLeft={false}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      icon={<SupportIcon $fontSize={iconFontSize} />}
      {...props}
      onClick={(e: MouseEvent) => {
        getHelpEvent();
        onClick?.(e);
      }}
    >
      {children ?? defaultText}
    </IconLink>
  );
}

export default ContactUsLink;
