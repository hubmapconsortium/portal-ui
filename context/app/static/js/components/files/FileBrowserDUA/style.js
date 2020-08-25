import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

const ObliqueSpan = styled.span`
  font-style: oblique 10deg;
`;

const StyledHeader = styled(Typography)`
  margin: ${(props) => props.theme.spacing(2)}px 0px;
`;

const StyledDiv = styled.div`
  margin-bottom: ${(props) => props.theme.spacing(2)}px;
`;

export { ObliqueSpan, StyledHeader, StyledDiv };
