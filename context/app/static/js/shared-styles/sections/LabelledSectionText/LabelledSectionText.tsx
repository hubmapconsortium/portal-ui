import React, { PropsWithChildren } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { TextContainer, StyledInfoIcon } from './style';

interface LabelledSectionTextProps extends PropsWithChildren {
  label: string;
  iconTooltipText?: string;
  bottomSpacing?: number;
  className?: string;
  childContainerComponent?: React.ElementType | React.ComponentType;
  ['data-testid']?: string;
}

function LabelledSectionText({
  children,
  label,
  iconTooltipText,
  bottomSpacing = 0,
  className,
  childContainerComponent = 'p',
  ...props // mainly for data-testid
}: LabelledSectionTextProps) {
  return (
    <TextContainer $bottomSpacing={bottomSpacing} className={className} {...props}>
      <Stack direction="row" alignItems='center'>
        <Typography variant="subtitle2" component="h3" color="primary">
          {label}
        </Typography>
        {iconTooltipText && (
          <SecondaryBackgroundTooltip title={iconTooltipText}>
            <StyledInfoIcon color="primary" />
          </SecondaryBackgroundTooltip>
        )}
      </Stack>
      <Typography component={childContainerComponent} variant="body1">
        {children}
      </Typography>
    </TextContainer>
  );
}


export default LabelledSectionText;
