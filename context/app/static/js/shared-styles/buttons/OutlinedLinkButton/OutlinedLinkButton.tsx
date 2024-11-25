import React, { PropsWithChildren } from 'react';
import LinkIcon from '@mui/icons-material/Link';
import LaunchRounded from '@mui/icons-material/LaunchRounded';
import OutlinedButton from 'js/shared-styles/buttons/OutlinedButton';

interface OutlinedLinkButtonProps extends PropsWithChildren {
  link: string;
  onClick?: () => void;
  external?: boolean;
}

function OutlinedLinkButton({ link, onClick, external, children }: OutlinedLinkButtonProps) {
  const EndIcon = external ? LaunchRounded : LinkIcon;

  return (
    <OutlinedButton
      color="info"
      href={link}
      onClick={onClick}
      endIcon={<EndIcon color="info" sx={{ width: '1rem' }} />}
    >
      {children}
    </OutlinedButton>
  );
}

export default OutlinedLinkButton;
