import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';

interface StoryControlTemplateProps {
  title: string;
  params: unknown;
  result: unknown;
}

export default function StoryControlTemplate({ title, params, result }: StoryControlTemplateProps) {
  return (
    <Stack>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body1">Params:</Typography>
      <pre>{JSON.stringify(params, null, 2)}</pre>
      <Typography variant="body1">Results:</Typography>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </Stack>
  );
}
