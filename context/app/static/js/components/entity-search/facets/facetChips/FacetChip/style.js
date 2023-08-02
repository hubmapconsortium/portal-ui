import styled from 'styled-components';
import Chip from '@mui/material/Chip';

const StyledChip = styled(Chip)`
  margin-bottom: ${(props) => props.theme.spacing(1)};
  margin-right: ${(props) => props.theme.spacing(0.5)};
`;

export { StyledChip };
