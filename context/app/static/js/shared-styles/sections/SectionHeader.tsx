import React, { ComponentProps, PropsWithChildren } from 'react';
import Typography from '@mui/material/Typography';

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
    <Typography variant="h4" component="h2" mb={1} {...rest}>
      {children}
      {iconTooltipText && (
        <SecondaryBackgroundTooltip title={iconTooltipText}>
          <StyledInfoIcon color="primary" />
        </SecondaryBackgroundTooltip>
      )}
    </Typography>
  );
}

export default SectionHeader;
