import React, { ComponentProps } from 'react';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';

function getOutboundLinkComponent(hasIcon: boolean) {
  if (hasIcon) {
    return OutboundIconLink;
  }
  return OutboundLink;
}

interface FilesConditionalLinkProps extends ComponentProps<typeof OutboundLink> {
  hasAgreedToDUA?: boolean | string;
  openDUA: () => void;
  href?: string;
  fileName: string;
  hasIcon?: boolean;
  onClick: () => void;
}

function FilesConditionalLink({
  hasAgreedToDUA,
  openDUA,
  href,
  fileName,
  hasIcon = false,
  onClick,
  ...rest
}: FilesConditionalLinkProps) {
  const Link = getOutboundLinkComponent(hasIcon);

  if (hasAgreedToDUA) {
    return (
      <Link href={href} onClick={onClick} {...rest}>
        {fileName}
      </Link>
    );
  }

  return (
    <Link
      onClick={() => {
        onClick();
        openDUA();
      }}
      component="button"
      underline="none"
      {...rest}
    >
      {fileName}
    </Link>
  );
}

export default FilesConditionalLink;
