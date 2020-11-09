import styled from 'styled-components';
import Container from '@material-ui/core/Container';

const StyledContainer = styled(Container)`
  margin-top: ${(props) => props.theme.spacing(2)}px;
`;

const MainWrapper = styled.div`
  flex-grow: 1;
`;

export { StyledContainer, MainWrapper };
