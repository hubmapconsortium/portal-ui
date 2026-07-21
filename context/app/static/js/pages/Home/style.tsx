import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container, { ContainerProps } from '@mui/material/Container';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { headerHeight } from 'js/components/Header/HeaderAppBar/style';
import { MUIIcon } from 'js/shared-styles/icons/entityIconMap';

interface GridAreaContainerProps extends ContainerProps {
  $gridArea: string;
}

const GridAreaContainer = styled(Container)<GridAreaContainerProps>(({ $gridArea }) => ({
  gridArea: $gridArea,
}));

const UpperGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridGap: theme.spacing(5),
  gridTemplateAreas: '"title" "carousel" "counts"',
  marginBottom: theme.spacing(5),
}));

const UpperLowerGrid = styled(Container)(({ theme }) => ({
  display: 'grid',
  gridGap: theme.spacing(3),
  gridTemplateAreas: '"bar-chart"',
  marginBottom: theme.spacing(3),
  marginTop: theme.spacing(3),
})) as typeof Container;

const BottomLowerGrid = styled(Container)(({ theme }) => ({
  display: 'grid',
  gridGap: theme.spacing(4),
  gridTemplateAreas: '"research-powered-by-hubmap" "testimonials" "guidelines" "related-tools-and-resources"',
  marginBottom: theme.spacing(5),
  width: '100%',
  marginTop: theme.spacing(2),
})) as typeof Container;

// Full-width, opaque wrapper so the bottom sections scroll up and cover the last parallax
// slide, matching how the parallax slides cover each other (instead of the last slide
// holding with dead scroll while nothing covers it).
const ParallaxCover = styled(Box)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.background.default,

  [theme.breakpoints.up('md')]: {
    // Higher zIndex than the slides (which use 1-4) + a one-viewport overlap so it slides
    // up over the last (pinned) slide.
    zIndex: 5,
    marginTop: '-100vh',
  },
}));

const SectionHeaderInternal = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  gap: theme.spacing(1),
})) as typeof Typography;

interface SectionHeaderProps extends TypographyProps {
  icon?: MUIIcon;
}

function SectionHeader({ icon: Icon, children, ...props }: SectionHeaderProps) {
  return (
    <SectionHeaderInternal {...props}>
      {Icon && <Icon fontSize="large" color="primary" />}
      {children}
    </SectionHeaderInternal>
  );
}

const OffsetDatasetsHeader = styled(SectionHeader)({
  scrollMarginTop: `${headerHeight + 10}px`,
}) as typeof SectionHeader;

export {
  GridAreaContainer,
  UpperGrid,
  UpperLowerGrid,
  BottomLowerGrid,
  ParallaxCover,
  SectionHeader,
  OffsetDatasetsHeader,
};
