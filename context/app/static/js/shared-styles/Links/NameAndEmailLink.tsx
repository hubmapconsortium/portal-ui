import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import { TooltipButton } from 'js/shared-styles/buttons/TooltipButton';
import { EmailIcon } from 'js/shared-styles/icons';

interface NameAndEmailLinkProps {
  first_name: string;
  last_name: string;
  email: string;
}
function NameAndEmailLink({ first_name, last_name, email }: NameAndEmailLinkProps) {
  return (
    <Stack direction="row" alignItems="center">
      <Typography>
        {first_name} {last_name} |&nbsp;
      </Typography>
      <OutboundLink href={`mailto:${email}`}>{email}</OutboundLink>
      <TooltipButton href={`mailto:${email}`} sx={{ minWidth: 0 }} tooltip={`Mail to ${email}`}>
        <EmailIcon color="info" />
      </TooltipButton>
    </Stack>
  );
}

export default NameAndEmailLink;
