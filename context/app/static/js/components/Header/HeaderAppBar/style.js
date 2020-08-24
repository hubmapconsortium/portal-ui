import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';

const StyledAppBar = styled(AppBar)`
  margin-bottom: ${(props) => props.theme.spacing(2)}px;
`;

export { StyledAppBar };
