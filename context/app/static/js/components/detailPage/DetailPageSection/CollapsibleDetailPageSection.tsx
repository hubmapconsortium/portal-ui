import React, { PropsWithChildren } from 'react';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Typography, { TypographyProps } from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { SvgIconComponent } from '@mui/icons-material';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { StyledInfoIcon } from 'js/shared-styles/sections/LabelledSectionText/style';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import DetailPageSection from './DetailPageSection';
import { DetailPageSectionAccordion } from './style';

export interface CollapsibleDetailPageSectionProps extends PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  title: string;
  icon?: SvgIconComponent;
  action?: React.ReactNode;
  variant?: TypographyProps['variant'];
  component?: TypographyProps['component'];
  iconTooltipText?: string;
}

export default function CollapsibleDetailPageSection({
  title,
  icon: IconOverride,
  children,
  variant = 'h4',
  component = 'h3',
  action,
  iconTooltipText,
  ...rest
}: CollapsibleDetailPageSectionProps) {
  const Icon = IconOverride ?? sectionIconMap[rest.id!] ?? null;
  return (
    <DetailPageSection {...rest}>
      <DetailPageSectionAccordion defaultExpanded disableGutters variant="unstyled">
        <AccordionSummary expandIcon={<ExpandMore />}>
          {Icon && <Icon fontSize="1.5rem" color="primary" />}
          <Typography variant={variant} component={component}>
            {title}
          </Typography>
          {iconTooltipText && (
            <SecondaryBackgroundTooltip title={iconTooltipText}>
              <StyledInfoIcon color="primary" />
            </SecondaryBackgroundTooltip>
          )}
          {action && (
            <Box
              onClick={(e) => {
                // Prevent the accordion from expanding/collapsing when the action is clicked
                e.stopPropagation();
              }}
              ml="auto"
            >
              {action}
            </Box>
          )}
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 0 }}>{children}</AccordionDetails>
      </DetailPageSectionAccordion>
    </DetailPageSection>
  );
}
