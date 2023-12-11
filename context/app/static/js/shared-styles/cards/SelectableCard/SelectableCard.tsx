import React, { ChangeEvent } from 'react';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { StyledCard, SelectableCardText } from './styles';

interface SelectableCardProps extends React.ComponentProps<typeof StyledCard> {
  title: string;
  description: string;
  tags?: string[];
  isSelected?: boolean;
  selectItem?: (e: ChangeEvent<HTMLInputElement>) => void;
  cardKey: string;
  disabled?: boolean;
  tooltip?: string;
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
  ...rest
}: SelectableCardProps) {
  const colorVariant = isSelected ? 'primaryContainer' : 'secondaryContainer';
  return (
    <SecondaryBackgroundTooltip title={tooltip}>
      <StyledCard $colorVariant={colorVariant} {...rest}>
        <CardContent component={Stack} direction="column" sx={{ height: '100%' }}>
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
                <Chip label={tag} sx={{ borderRadius: 8, backgroundColor: 'white.main' }} key={tag} />
              ))}
            </Stack>
          )}
        </CardContent>
      </StyledCard>
    </SecondaryBackgroundTooltip>
  );
}

export default SelectableCard;
