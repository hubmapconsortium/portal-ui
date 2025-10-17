import React, { ChangeEvent } from 'react';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { StyledCard, SelectableCardText } from './styles';
import Box from '@mui/material/Box';

interface SelectableCardProps extends React.ComponentProps<typeof StyledCard> {
  title: React.ReactNode;
  description: string;
  tags?: string[];
  isSelected?: boolean;
  selectItem?: (e: ChangeEvent<HTMLInputElement>) => void;
  cardKey: string;
  disabled?: boolean;
  tooltip?: string;
  category?: string;
  grow?: boolean;
}

function useColorVariant(
  isSelected?: boolean,
  isSelectable?: boolean,
): 'primaryContainer' | 'secondaryContainer' | undefined {
  if (isSelected) return 'primaryContainer';
  if (isSelectable) return 'secondaryContainer';
  return undefined;
}

function SelectableCard({
  title,
  description,
  tags = [],
  isSelected = false,
  selectItem,
  cardKey,
  disabled,
  tooltip,
  category,
  grow = false,
  children,
  ...rest
}: SelectableCardProps) {
  const isSelectable = Boolean(selectItem);
  const colorVariant = useColorVariant(isSelected, isSelectable);
  return (
    <SecondaryBackgroundTooltip title={tooltip}>
      <StyledCard $grow={grow} $colorVariant={colorVariant} {...rest}>
        <CardContent component={Stack} direction="column" sx={{ height: '100%' }}>
          {category && (
            <Box>
              <Chip label={category} borderRadius="halfRound" sx={{ backgroundColor: 'accent.info90', mb: 1 }} />
            </Box>
          )}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <SelectableCardText variant="subtitle1" $colorVariant={colorVariant}>
              {title}
            </SelectableCardText>
            {selectItem && <Checkbox checked={isSelected} onChange={selectItem} value={cardKey} disabled={disabled} />}
          </Stack>
          <SelectableCardText gutterBottom $colorVariant={colorVariant}>
            {description}
          </SelectableCardText>
          {tags.length > 0 && (
            <Stack spacing={2} direction="row" useFlexGap flexWrap="wrap" mt="auto">
              {tags.map((tag) => (
                <Chip
                  borderRadius="halfRound"
                  label={tag}
                  variant="outlined"
                  sx={{ backgroundColor: 'white.main' }}
                  key={tag}
                />
              ))}
            </Stack>
          )}
          {children}
        </CardContent>
      </StyledCard>
    </SecondaryBackgroundTooltip>
  );
}

export default SelectableCard;
