import styled from 'styled-components';
import Divider from '@material-ui/core/Divider';

const VerticalDivider = styled(Divider)`
  margin-left: ${(props) => props.theme.spacing(2)}px;
  margin-right: ${(props) => props.theme.spacing(2)}px;
  height: 100%;
  align-self: center;
`;

export { VerticalDivider };
