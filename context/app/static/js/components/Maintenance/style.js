import Container from '@material-ui/core/Container';
import styled from 'styled-components';

const Background = styled.div`
  background-color: ${(props) => props.theme.palette.warning.main};
  margin-top: -16px; // Override the Header's margin.
`;

const StyledContainer = styled(Container)`
  position: absolute;
  top: 40%;
  transform: translateY(-40%) translateX(-50%);
  left: 50%;
`;

export { Background, StyledContainer };
