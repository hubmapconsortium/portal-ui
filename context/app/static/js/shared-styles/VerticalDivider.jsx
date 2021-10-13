import styled from 'styled-components';
import Divider from '@material-ui/core/Divider';

const VerticalDivider = styled(Divider)`
  margin-left: ${(props) => props.theme.spacing(1)}px;
  margin-right: ${(props) => props.theme.spacing(1)}px;
  height: 15px;
  width: 1px;
  background-color: ${(props) => props.theme.palette.text.primary};
  align-self: center;
`;

export default VerticalDivider;
