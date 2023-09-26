import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

interface SelectableCardProps {
  title: string;
  description: string;
  tags?: string[];
}

function SelectableCard({ title, description, tags }: SelectableCardProps) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          {title}
        </Typography>
        <Typography gutterBottom>{description}</Typography>
        <Stack spacing={2} direction="row" useFlexGap flexWrap="wrap">
          {tags.map((tag) => (
            <Chip label={tag} sx={{ borderRadius: 8 }} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default SelectableCard;
