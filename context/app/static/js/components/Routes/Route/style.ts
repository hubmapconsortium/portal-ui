import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

// max width for a lg container
const routeContainerMaxWidth = 1232;
const routeContainerPadding = 32;

const GridWrapper = styled(Box)<{ $shouldShowBoundaries: boolean }>(({ $shouldShowBoundaries }) => ({
  display: 'grid',
  gridTemplateColumns: $shouldShowBoundaries ? `1fr minmax(0, ${routeContainerMaxWidth}px) 1fr` : '1fr',
  width: '100%',
  flexGrow: 1,
  gap: 0,
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  flexDirection: 'column',
  display: 'flex',
  minWidth: 0, // Allow container to shrink below content size in grid
})) as typeof Container;

export { StyledContainer, GridWrapper, routeContainerMaxWidth, routeContainerPadding };
