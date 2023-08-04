import styled from 'styled-components';
import Divider from '@mui/material/Divider';
import DialogTitle from '@mui/material/DialogTitle';

const StyledDialogTitle = styled(DialogTitle)`
  margin-bottom: ${(props) => props.theme.spacing(2)};
  padding: 16px 24px 0px 24px;
`;
const StyledDivider = styled(Divider)`
  background-color: ${(props) => props.theme.palette.primary.main};
  height: 1.5px;
  margin-top: ${(props) => props.theme.spacing(1)};
`;

export { StyledDivider, StyledDialogTitle };
