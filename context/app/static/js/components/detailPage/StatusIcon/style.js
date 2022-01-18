import styled from 'styled-components';
import LensIcon from '@material-ui/icons/LensRounded';

const ColoredStatusIcon = styled(LensIcon)`
  color: ${(props) => props.theme.palette[props.$iconColor].main};
  font-size: 16px;
  margin-right: 3px;
  margin-bottom: -2.5px;
`;

export { ColoredStatusIcon };
