import styled from 'styled-components';
import LensIcon from '@material-ui/icons/LensRounded';

const ColoredStatusIcon = styled(LensIcon)`
  color: ${(props) => props.theme.palette[props.$iconColor].main};
  font-size: 16px;
  margin-right: 3px;
  align-self: center;
`;

export { ColoredStatusIcon };
