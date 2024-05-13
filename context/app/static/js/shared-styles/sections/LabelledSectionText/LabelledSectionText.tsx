import React from 'react';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';

import InfoTooltipIcon from 'js/shared-styles/icons/TooltipIcon';
import { TextContainer } from './style';

interface LabelledSectionTextProps extends StackProps {
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
      <Stack direction="row" alignItems="center">
        <Typography variant="subtitle2" component="h3" color="primary">
          {label}
        </Typography>
        <InfoTooltipIcon iconTooltipText={iconTooltipText} />
      </Stack>
      <Typography component={childContainerComponent} variant="body1">
        {children}
      </Typography>
    </TextContainer>
  );
}

export default LabelledSectionText;
