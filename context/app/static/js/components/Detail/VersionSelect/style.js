import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import LensIcon from '@material-ui/icons/LensRounded';

const StyledButton = styled(Button)`
  background-color: #fff;
  margin-right: 4px;
  text-transform: lowercase;
`;

const VersionStatusIcon = styled(LensIcon)`
  color: ${(props) => props.theme.palette[props.$iconColor].main};
  font-size: 16px;
  margin-right: 3px;
`;

export { StyledButton, VersionStatusIcon };
