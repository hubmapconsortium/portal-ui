import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';

const StyledDiv = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 10px;
`;

const StyledTextField = styled(TextField)`
  margin: 12px 0px;
`;

export { StyledDiv, StyledTextField };
