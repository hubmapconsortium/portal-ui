import styled from 'styled-components';
import TextField from '@mui/material/TextField';

const StyledTextField = styled(TextField)`
  margin: ${(props) => props.theme.spacing(3)} 0px;
`;

export { StyledTextField };
