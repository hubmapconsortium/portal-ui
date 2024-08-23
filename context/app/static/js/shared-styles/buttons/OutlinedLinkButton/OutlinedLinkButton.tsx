import React from 'react';
import Button from '@mui/material/Button';
import LinkIcon from '@mui/icons-material/Link';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

interface OutlinedLinkButtonProps {
  label: string;
  link: string;
}

function OutlinedLinkButton({ label, link }: OutlinedLinkButtonProps) {
  return (
    <Button
      variant="outlined"
      color="info"
      sx={(theme) => ({
        borderColor: theme.palette.grey[300],
        borderRadius: theme.spacing(0.5),
      })}
      href={link}
    >
      <Typography variant="inherit" marginRight=".5rem">
        {label}
      </Typography>
      <SvgIcon component={LinkIcon} color="info" sx={{ fontSize: '1rem' }} />
    </Button>
  );
}

export default OutlinedLinkButton;
