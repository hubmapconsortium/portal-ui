import styled from 'styled-components';
import Typography from '@mui/material/Typography';

const ObliqueSpan = styled.span`
  font-style: oblique 10deg;
`;

const StyledHeader = styled(Typography)`
  margin: ${(props) => props.theme.spacing(2)} 0px;
`;

const StyledDiv = styled.div`
  margin-bottom: ${(props) => props.theme.spacing(2)};
`;

export { ObliqueSpan, StyledHeader, StyledDiv };
