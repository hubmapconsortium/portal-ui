import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';

const StyledPaper = styled(Paper)`
  margin-top: ${(props) => props.theme.spacing(1)}px;
  max-height: 260px; // 250px in the mockup, but added 10px so it's clearly scrollable
  overflow-y: scroll;
`;

export { StyledPaper };
