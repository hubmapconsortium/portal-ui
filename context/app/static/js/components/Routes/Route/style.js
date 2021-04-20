import styled from 'styled-components';
import Container from '@material-ui/core/Container';

const StyledContainer = styled(Container)`
  margin-top: ${(props) => props.theme.spacing(2)}px;
  background-color: ${(props) => props.theme.palette.background.default};
`;

const MainWrapper = styled.div`
  flex-grow: 1;
`;

// max width for a lg container
const routeContainerMaxWidth = 1232;
const routeContainerPadding = 32;

export { StyledContainer, MainWrapper, routeContainerMaxWidth, routeContainerPadding };
