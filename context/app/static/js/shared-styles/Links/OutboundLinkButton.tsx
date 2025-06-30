import React from 'react';
import Button from '@mui/material/Button';

import { useTrackOutboundLink } from 'js/hooks/useTrackOutboundLink';
import StyledOpenInNewRoundedIcon from './StyledOpenInNewRoundedIcon';

type OutboundLinkButtonProps = React.ComponentProps<typeof Button<'a'>>;

function OutboundLinkButton({ children, onClick, ...props }: OutboundLinkButtonProps) {
  const trackClick = useTrackOutboundLink();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackClick(e);
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Button
      color="primary"
      variant="contained"
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      {...props}
      component="a"
    >
      {children} <StyledOpenInNewRoundedIcon />
    </Button>
  );
}

export default OutboundLinkButton;
