import styled from 'styled-components';

import TextField from '@mui/material/TextField';

const StyledTextField = styled(TextField)`
  & > :first-child {
    border-radius: 4px;
  }
`;

export { StyledTextField };
