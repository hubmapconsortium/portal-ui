import styled from 'styled-components';
import Chip from '@material-ui/core/Chip';

const StyledChip = styled(Chip)`
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
  margin-right: ${(props) => props.theme.spacing(0.5)}px;
`;

export { StyledChip };
