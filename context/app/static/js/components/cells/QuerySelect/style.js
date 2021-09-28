import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';

const StyledTextField = styled(TextField)`
  margin: ${(props) => props.theme.spacing(3)}px 0px;
`;

export { StyledTextField };
