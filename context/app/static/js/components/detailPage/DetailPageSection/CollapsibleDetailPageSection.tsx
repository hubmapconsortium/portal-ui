import React, { PropsWithChildren } from 'react';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Typography, { TypographyProps } from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { SvgIconComponent } from '@mui/icons-material';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { StyledInfoIcon } from 'js/shared-styles/sections/LabelledSectionText/style';
import { sectionIconMap, sectionImageIconMap } from 'js/shared-styles/icons/sectionIconMap';
import ExternalImageIcon from 'js/shared-styles/icons/ExternalImageIcon';
import DetailPageSection from './DetailPageSection';
import { DetailPageSectionAccordion, StyledExternalImageIconContainer, StyledSvgIcon } from './style';

export interface CollapsibleDetailPageSectionProps extends PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
  title: string;
  icon?: SvgIconComponent;
  action?: React.ReactNode;
  variant?: TypographyProps['variant'];
  component?: TypographyProps['component'];
  iconTooltipText?: string;
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
  ...rest
}: CollapsibleDetailPageSectionProps) {
  return (
    <DetailPageSection {...rest}>
      <DetailPageSectionAccordion defaultExpanded disableGutters variant="unstyled">
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
              sx={{ position: 'absolute', right: 0, top: 0 }}
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
