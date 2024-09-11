import React, { PropsWithChildren } from 'react';
import LinkIcon from '@mui/icons-material/Link';
import { StyledButton } from 'js/shared-styles/buttons/OutlinedLinkButton/style';

interface OutlinedLinkButtonProps extends PropsWithChildren {
  link: string;
}

function OutlinedLinkButton({ link, children }: OutlinedLinkButtonProps) {
  return (
    <StyledButton
      variant="outlined"
      color="info"
      href={link}
      endIcon={<LinkIcon color="info" sx={{ width: '1rem' }} />}
    >
      {children}
    </StyledButton>
  );
}

export default OutlinedLinkButton;
