import React, { ComponentProps, MouseEvent, PropsWithChildren } from 'react';
import IconLink from './iconLinks/IconLink';
import { trackLink } from 'js/helpers/trackers';
import { EmailIcon } from '../icons';

type HelpLinkProps = PropsWithChildren<Omit<ComponentProps<typeof IconLink>, 'isOutbound' | 'href'>> & {
  iconFontSize?: string;
};

const href = 'https://hubmapconsortium.org/contact-form/';
const defaultText = 'contact us';

function getHelpEvent() {
  const href = window.location.href;
  trackLink(href, 'help_form');
}

function HelpLink({ iconFontSize, children, ...props }: HelpLinkProps) {
  return (
    <IconLink 
      href={href} 
      isOutbound={true} 
      iconOnLeft={false}
      // @ts-ignore
      icon={<EmailIcon $fontSize={iconFontSize} />} 
      {...props}>
      {children ?? defaultText}
      onClick={(e: MouseEvent) => {
        getHelpEvent(); 
        props?.onClick(e)
      }} 
    </IconLink>
  );
}

export default HelpLink;
