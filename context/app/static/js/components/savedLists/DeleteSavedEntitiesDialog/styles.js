import styled from 'styled-components';
import Button from '@material-ui/core/Button';

const OrangeButton = styled(Button)`
  color: ${(props) => props.theme.palette.warning.main};
`;

export { OrangeButton };
