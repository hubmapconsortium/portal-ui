import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CheckList } from './styles';

interface ToolDescriptionProps {
  subtitle: string;
  checklistItems: string[];
  ctaText?: string;
  ctaLink?: string;
  ctaIcon?: React.ReactNode;
}

export function ToolDescription({ subtitle, checklistItems, ctaText, ctaLink, ctaIcon }: ToolDescriptionProps) {
  return (
    <Box p={2}>
      <Typography variant="subtitle1">{subtitle}</Typography>
      <CheckList>
        {checklistItems.map((item) => (
          <Typography variant="body1" component="li" key={item}>
            {item}
          </Typography>
        ))}
      </CheckList>
      {ctaText && ctaLink && (
        <Button href={ctaLink} startIcon={ctaIcon} variant="outlined">
          {ctaText}
        </Button>
      )}
    </Box>
  );
}
