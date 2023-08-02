import styled from 'styled-components';
import Divider from '@mui/material/Divider';

const VerticalDivider = styled(Divider)`
  margin-left: ${(props) => props.theme.spacing(2)};
  margin-right: ${(props) => props.theme.spacing(2)};
  height: 100%;
  align-self: center;
`;

export { VerticalDivider };
