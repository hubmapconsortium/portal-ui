import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';

const PrimaryOutlinedTextField = styled(TextField)`
  && {
    div &:hover fieldset {
      border-color: ${(props) => props.theme.palette.primary.main};
    }
  }
`;

const StyledPrimaryOutlineTextField = styled(PrimaryOutlinedTextField)`
  margin-bottom: ${(props) => props.theme.spacing(2)}px;
`;

const StyledDivider = styled(Divider)`
  background-color: ${(props) => props.theme.palette.primary.main};
  height: 1.5px;
  margin-top: ${(props) => props.theme.spacing(1)}px;
`;

export { PrimaryOutlinedTextField, StyledPrimaryOutlineTextField, StyledDivider };
