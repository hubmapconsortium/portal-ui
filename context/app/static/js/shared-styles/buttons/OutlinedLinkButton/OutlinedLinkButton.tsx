import React, { PropsWithChildren } from 'react';
import LinkIcon from '@mui/icons-material/Link';
import LaunchRounded from '@mui/icons-material/LaunchRounded';
import { StyledButton } from 'js/shared-styles/buttons/OutlinedLinkButton/style';

interface OutlinedLinkButtonProps extends PropsWithChildren {
  link: string;
  onClick?: () => void;
  external?: boolean;
}

function OutlinedLinkButton({ link, onClick, external, children }: OutlinedLinkButtonProps) {
  const EndIcon = external ? LaunchRounded : LinkIcon;

  return (
    <StyledButton
      variant="outlined"
      color="info"
      href={link}
      onClick={onClick}
      endIcon={<EndIcon color="info" sx={{ width: '1rem' }} />}
    >
      {children}
    </StyledButton>
  );
}

export default OutlinedLinkButton;
