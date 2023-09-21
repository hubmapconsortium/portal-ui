import React from 'react';
import Button from '@mui/material/Button';
import { sendOutboundEvent } from './OutboundLink';
import StyledOpenInNewRoundedIcon from './StyledOpenInNewRoundedIcon';

type OutboundLinkButtonProps = React.ComponentProps<typeof Button<'a'>>;

function OutboundLinkButton({ children, ...props }: OutboundLinkButtonProps) {
  return (
    <Button
      {...props}
      color="primary"
      variant="contained"
      component="a"
      target="_blank"
      rel="noopener noreferrer"
      onClick={sendOutboundEvent}
    >
      {children} <StyledOpenInNewRoundedIcon />
    </Button>
  );
}

export default OutboundLinkButton;
