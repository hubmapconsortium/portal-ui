import React, { PropsWithChildren } from 'react';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Typography, { TypographyProps } from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { SvgIconComponent } from '@mui/icons-material';
import DetailPageSection from './DetailPageSection';
import { DetailPageSectionAccordion } from './style';

interface CollapsibleDetailPageSectionProps extends PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  title: string;
  icon?: SvgIconComponent;
  action?: React.ReactNode;
  variant?: TypographyProps['variant'];
  component?: TypographyProps['component'];
}

export default function CollapsibleDetailPageSection({
  title,
  icon: Icon,
  children,
  variant = 'h4',
  component = 'h3',
  action,
  ...rest
}: CollapsibleDetailPageSectionProps) {
  return (
    <DetailPageSection {...rest}>
      <DetailPageSectionAccordion defaultExpanded disableGutters variant="unstyled">
        <AccordionSummary expandIcon={<ExpandMore />}>
          {Icon && <Icon fontSize="1.5rem" color="primary" />}
          <Typography variant={variant} component={component}>
            {title}
          </Typography>
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
