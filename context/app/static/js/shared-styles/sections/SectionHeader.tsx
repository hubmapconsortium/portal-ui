import React, { ComponentProps, PropsWithChildren } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { StyledInfoIcon } from './LabelledSectionText/style';

type TypographyProps = ComponentProps<typeof Typography<'h2'>>;

type SectionHeaderProps = PropsWithChildren<
  Partial<TypographyProps> & {
    iconTooltipText?: string;
  }
>;

function SectionHeader({ children, iconTooltipText, ...rest }: SectionHeaderProps) {
  return (
    <Box display="flex" alignItems="center" mb={1}>
      <Typography variant="h4" component="h2" {...rest}>
        {children}
      </Typography>
      {iconTooltipText && (
        <SecondaryBackgroundTooltip title={iconTooltipText}>
          <StyledInfoIcon color="primary" />
        </SecondaryBackgroundTooltip>
      )}
    </Box>
  );
}

export default SectionHeader;
