import styled from 'styled-components';
import Container from '@material-ui/core/Container';

const Background = styled.div`
  background-color: #cfd3e2;
`;

const FlexContainer = styled(Container)`
  @media (min-width: ${(props) => props.theme.breakpoints.values.sm}px) {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
`;

export { Background, FlexContainer };
