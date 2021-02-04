import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';

const PrimaryOutlinedTextField = styled(TextField)`
  && {
    div &:hover fieldset {
      border-color: ${(props) => props.theme.palette.primary.main};
    }
  }
`;

export { PrimaryOutlinedTextField };
