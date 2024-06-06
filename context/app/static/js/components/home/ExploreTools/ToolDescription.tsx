import React from 'react';
import { Button, Typography } from '@mui/material';
import { CheckList } from './styles';

interface ToolDescriptionProps {
  subtitle: string;
  checklistItems: string[];
  ctaText?: string;
  ctaLink?: string;
}

export function ToolDescription({ subtitle, checklistItems, ctaText, ctaLink }: ToolDescriptionProps) {
  return (
    <>
      <Typography variant="subtitle1">{subtitle}</Typography>
      <CheckList>
        {checklistItems.map((item) => (
          <Typography variant="body1" component="li" key={item}>
            {item}
          </Typography>
        ))}
      </CheckList>
      {ctaText && ctaLink && (
        <Button href={ctaLink} variant="outlined">
          {ctaText}
        </Button>
      )}
    </>
  );
}
