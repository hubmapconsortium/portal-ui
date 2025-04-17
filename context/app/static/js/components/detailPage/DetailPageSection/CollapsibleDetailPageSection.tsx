import React, { PropsWithChildren, useState } from 'react';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Typography, { TypographyProps } from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { SvgIconComponent } from '@mui/icons-material';
import { useEventCallback } from '@mui/material/utils';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { StyledInfoIcon } from 'js/shared-styles/sections/LabelledSectionText/style';
import { sectionIconMap, sectionImageIconMap } from 'js/shared-styles/icons/sectionIconMap';
import ExternalImageIcon from 'js/shared-styles/icons/ExternalImageIcon';
import { EventInfo } from 'js/components/types';
import { trackEvent } from 'js/helpers/trackers';

import DetailPageSection from './DetailPageSection';
import { DetailPageSectionAccordion, StyledExternalImageIconContainer, StyledSvgIcon } from './style';

export interface CollapsibleDetailPageSectionProps extends PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  title: string;
  icon?: SvgIconComponent;
  action?: React.ReactNode;
  variant?: TypographyProps['variant'];
  component?: TypographyProps['component'];
  iconTooltipText?: string;
  trackingInfo?: EventInfo;
}

interface IconDisplayProps {
  icon?: SvgIconComponent;
  id: string;
}

function IconDisplay({ icon: IconOverride, id }: IconDisplayProps) {
  if (Boolean(IconOverride) || sectionIconMap[id]) {
    return <StyledSvgIcon as={IconOverride ?? sectionIconMap[id]} fontSize="medium" color="primary" />;
  }
  const externalImageKey = sectionImageIconMap[id];
  if (externalImageKey) {
    return (
      <StyledExternalImageIconContainer>
        <ExternalImageIcon icon={externalImageKey} />
      </StyledExternalImageIconContainer>
    );
  }
  return null;
}

export default function CollapsibleDetailPageSection({
  title,
  icon,
  children,
  variant = 'h4',
  component = 'h3',
  action,
  iconTooltipText,
  trackingInfo,
  ...rest
}: CollapsibleDetailPageSectionProps) {
  // Handle expanded state manually in order to track the event
  const [expanded, setExpanded] = useState(true);

  const handleAccordionToggle = useEventCallback(() => {
    const newExpandedState = !expanded;
    setExpanded(newExpandedState);

    if (trackingInfo) {
      trackEvent({
        action: `${newExpandedState ? 'Expand' : 'Collapse'} Section`,
        label: title,
        ...trackingInfo,
      });
    }
  });

  return (
    <DetailPageSection {...rest}>
      <DetailPageSectionAccordion
        expanded={expanded}
        onChange={handleAccordionToggle}
        disableGutters
        variant="unstyled"
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <IconDisplay icon={icon} id={rest.id!} />
          <Typography variant={variant} component={component}>
            {title}
          </Typography>
          {iconTooltipText && (
            <SecondaryBackgroundTooltip title={iconTooltipText}>
              <StyledInfoIcon color="primary" />
            </SecondaryBackgroundTooltip>
          )}
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 0 }}>
          {action && (
            <Box
              onClick={(e) => {
                // Prevent the accordion from expanding/collapsing when the action is clicked
                e.stopPropagation();
              }}
              ml="auto"
              className="accordion-section-action"
              sx={{ position: 'absolute', right: 0, top: 7 }}
            >
              {action}
            </Box>
          )}
          {children}
        </AccordionDetails>
      </DetailPageSectionAccordion>
    </DetailPageSection>
  );
}
