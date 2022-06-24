import styled from 'styled-components';

import TextField from '@material-ui/core/TextField';

const StyledTextField = styled(TextField)`
  & > :first-child {
    border-radius: 4px;
  }
`;

export { StyledTextField };
