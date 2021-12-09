import styled from 'styled-components';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
  margin-left: ${(props) => props.theme.spacing(1)}px;
`;

export { StyledToggleButtonGroup };
