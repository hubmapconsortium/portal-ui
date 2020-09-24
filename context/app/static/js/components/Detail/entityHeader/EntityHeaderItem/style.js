import styled from 'styled-components';
import Divider from '@material-ui/core/Divider';

const VerticalDivider = styled(Divider)`
  margin-left: ${(props) => props.theme.spacing(2)}px;
  margin-right: ${(props) => props.theme.spacing(2)}px;
  height: 100%;
  background-color: ${(props) => props.theme.palette.collectionsDivider.main};
  align-self: center;
`;

export { VerticalDivider };
