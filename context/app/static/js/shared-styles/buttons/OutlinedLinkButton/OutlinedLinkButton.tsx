import React, { PropsWithChildren } from 'react';
import Button from '@mui/material/Button';
import LinkIcon from '@mui/icons-material/Link';

interface OutlinedLinkButtonProps extends PropsWithChildren {
  link: string;
}

function OutlinedLinkButton({ link, children }: OutlinedLinkButtonProps) {
  return (
    <Button
      variant="outlined"
      color="info"
      sx={(theme) => ({
        borderColor: theme.palette.grey[300],
        borderRadius: theme.spacing(0.5),
      })}
      href={link}
      endIcon={<LinkIcon color="info" fontSize="1rem" />}
    >
      {children}
    </Button>
  );
}

export default OutlinedLinkButton;
