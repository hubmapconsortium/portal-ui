import styled from 'styled-components';
import TextField from '@mui/material/TextField';

const PrimaryOutlinedTextField = styled(TextField)`
  && {
    div &:hover fieldset {
      border-color: ${(props) => props.theme.palette.primary.main};
    }
  }
`;

export { PrimaryOutlinedTextField };
