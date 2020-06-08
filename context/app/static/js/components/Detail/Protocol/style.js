import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';

const StyledTypography = styled(Typography)`
  margin: 2px 0px 2px 0px;
`;

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.palette.info.main};
`;

const StyledPaper = styled(Paper)`
  padding: 20px 40px 20px 40px;
`;

export { StyledTypography, StyledLink, StyledPaper };
