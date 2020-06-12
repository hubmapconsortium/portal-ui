import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const Background = styled.div`
  background-color: ${(props) => props.theme.palette.transparentGray.main};
  padding: ${(props) => props.theme.spacing(2, 1)};
`;

const MainText = styled(Typography)`
  margin-top: ${(props) => props.theme.spacing(props.mt)}px;
`;
const StyledLink = styled(Link)`
  color: ${(props) => props.theme.palette.info.main};
`;

export { Background, MainText, StyledLink };
