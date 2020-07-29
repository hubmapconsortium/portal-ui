import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';

// TODO: Copy and paste from Attribution.

const StyledTypography = styled(Typography)`
  margin: 2px 0px 2px 0px;
`;

// TODO: Define this color globally?
const StyledLink = styled(Link)`
  color: rgb(55, 129, 209);
`;

const FlexPaper = styled(Paper)`
  display: flex;
  padding: 30px 40px 30px 40px;
`;

export { StyledTypography, StyledLink, FlexPaper };
