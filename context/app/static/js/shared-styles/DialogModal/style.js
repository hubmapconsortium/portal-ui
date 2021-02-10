import styled from 'styled-components';
import Divider from '@material-ui/core/Divider';

const StyledDivider = styled(Divider)`
  background-color: ${(props) => props.theme.palette.primary.main};
  height: 1.5px;
  margin-top: ${(props) => props.theme.spacing(1)}px;
`;

export { StyledDivider };
