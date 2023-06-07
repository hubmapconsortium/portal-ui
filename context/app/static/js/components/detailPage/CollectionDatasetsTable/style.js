import styled from 'styled-components';
import Link from '@mui/material/Link';

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.palette.info.main};
`;

export { StyledLink };
