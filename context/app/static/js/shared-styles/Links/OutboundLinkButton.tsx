import React from 'react';
import Button from '@mui/material/Button';

import { useTrackOutboundLink } from 'js/hooks/useTrackOutboundLink';
import StyledOpenInNewRoundedIcon from './StyledOpenInNewRoundedIcon';

type OutboundLinkButtonProps = React.ComponentProps<typeof Button<'a'>>;

function OutboundLinkButton({ children, ...props }: OutboundLinkButtonProps) {
  const handleClick = useTrackOutboundLink();
  return (
    <Button
      {...props}
      color="primary"
      variant="contained"
      component="a"
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
    >
      {children} <StyledOpenInNewRoundedIcon />
    </Button>
  );
}

export default OutboundLinkButton;
