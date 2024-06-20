import { styled } from '@mui/material/styles';
import Container, { ContainerProps } from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { headerHeight } from 'js/components/Header/HeaderAppBar/style';

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
  gridTemplateAreas: '"recent-entities" "explore-tools" "guidelines" "external-links"',
  marginBottom: theme.spacing(5),

  [theme.breakpoints.up('md')]: {
    gridTemplateAreas: '"bar-chart" "recent-entities" "explore-tools" "guidelines" "external-links"',
  },
})) as typeof Container;

const SectionHeader = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
})) as typeof Typography;

const OffsetDatasetsHeader = styled(SectionHeader)({
  scrollMarginTop: `${headerHeight + 10}px`,
}) as typeof Typography;

export { GridAreaContainer, UpperGrid, LowerContainerGrid, SectionHeader, OffsetDatasetsHeader };
