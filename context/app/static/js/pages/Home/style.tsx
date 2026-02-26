import React from 'react';
import { styled } from '@mui/material/styles';
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

const LowerContainerGrid = styled(Container)(({ theme }) => ({
  display: 'grid',
  gridGap: theme.spacing(3),
  gridTemplateAreas: '"recent-entities" "explore-tools" "guidelines" "related-tools-and-resources"',
  marginBottom: theme.spacing(5),

  [theme.breakpoints.up('md')]: {
    gridTemplateAreas: '"bar-chart" "recent-entities" "explore-tools" "guidelines" "related-tools-and-resources"',
  },
})) as typeof Container;

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

export { GridAreaContainer, UpperGrid, LowerContainerGrid, SectionHeader, OffsetDatasetsHeader };
