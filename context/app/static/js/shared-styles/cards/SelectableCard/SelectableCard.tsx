import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography, { TypographyProps } from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import { SxProps, Theme, styled } from '@mui/material/styles';

interface SelectableCardProps {
  title: string;
  description: string;
  tags?: string[];
  isSelected: boolean;
  selectItem: (itemKey: string) => void;
  cardKey: string;
  sx?: SxProps<Theme> | SxProps<Theme>[];
}

interface SelectableCardTextProps extends TypographyProps {
  $colorVariant: 'primaryContainer' | 'secondaryContainer';
}

const SelectableCardText = styled(Typography)<SelectableCardTextProps>(({ theme, $colorVariant }) => ({
  color: theme.palette[$colorVariant].contrastText,
})) as typeof Typography;

function SelectableCard({ title, description, tags, isSelected, selectItem, cardKey, sx = [] }: SelectableCardProps) {
  const colorVariant = isSelected ? 'primaryContainer' : 'secondaryContainer';
  return (
    <Card
      sx={[
        {
          minWidth: 275,
          backgroundColor: `${colorVariant}.main`,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <CardContent component={Stack} direction="column" sx={{ height: '100%' }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <SelectableCardText variant="subtitle1" $colorVariant={colorVariant}>
            {title}
          </SelectableCardText>
          <Checkbox checked={isSelected} onChange={() => selectItem(cardKey)} />
        </Stack>
        <SelectableCardText gutterBottom $colorVariant={colorVariant}>
          {description}
        </SelectableCardText>
        <Stack spacing={2} direction="row" useFlexGap flexWrap="wrap" sx={{ marginTop: 'auto' }}>
          {tags.map((tag) => (
            <Chip label={tag} sx={{ borderRadius: 8, backgroundColor: 'white.main' }} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default SelectableCard;
