import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  flexGrow: 1,
  flexDirection: 'column',
  display: 'flex',
  marginLeft: 0,
  marginRight: 0,
})) as typeof Container;

// max width for a lg container
const routeContainerMaxWidth = 1232;
const routeContainerPadding = 32;

export { StyledContainer, routeContainerMaxWidth, routeContainerPadding };
