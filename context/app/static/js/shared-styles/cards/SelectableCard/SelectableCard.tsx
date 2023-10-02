import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';

interface SelectableCardProps {
  title: string;
  description: string;
  tags?: string[];
  isSelected: boolean;
  selectItem: (itemKey: string) => void;
  cardKey: string;
}

function SelectableCard({ title, description, tags, isSelected, selectItem, cardKey }: SelectableCardProps) {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">{title}</Typography>
          <Checkbox checked={isSelected} onChange={() => selectItem(cardKey)} />
        </Stack>
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
