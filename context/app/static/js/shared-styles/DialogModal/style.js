import styled from 'styled-components';
import Divider from '@material-ui/core/Divider';
import DialogTitle from '@material-ui/core/DialogTitle';

const StyledDialogTitle = styled(DialogTitle)`
  padding: 16px 24px 0px 24px;
`;
const StyledDivider = styled(Divider)`
  background-color: ${(props) => props.theme.palette.primary.main};
  height: 1.5px;
  margin-top: ${(props) => props.theme.spacing(1)}px;
`;

export { StyledDivider, StyledDialogTitle };
