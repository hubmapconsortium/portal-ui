import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

const Background = styled.div`
  grid-area: about;
  background-color: ${(props) => props.theme.palette.primary.main};
`;

const StyledContainer = styled(Container)`
  min-height: 216px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const MainText = styled(Typography)`
  color: #ffffff;
  margin-top: ${(props) => props.theme.spacing(1)}px;
`;

const Title = styled(Typography)`
  color: #ffffff;
  padding-bottom: ${(props) => props.theme.spacing(1)}px;
  border-bottom: 1px solid #ffffff;
`;

export { Background, StyledContainer, MainText, Title };
