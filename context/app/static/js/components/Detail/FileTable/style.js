import styled from 'styled-components';
import Link from '@material-ui/core/Link';

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.palette.info.main};
`;

export { StyledLink };
