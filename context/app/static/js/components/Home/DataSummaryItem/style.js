import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const StyledTypography = styled(Typography)`
  margin-left: ${(props) => props.theme.spacing(1)}px;
`;

const StyledLink = styled(Link)`
  display: flex;

  @media (max-width: ${(props) => props.theme.breakpoints.values.md}px) {
    flex-basis: 50%;
  }
`;

export { StyledTypography, StyledLink };
