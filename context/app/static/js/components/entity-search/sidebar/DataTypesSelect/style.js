import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';

const StyledPaper = styled(Paper)`
  min-width: 300px;
  margin-right: ${(props) => props.theme.spacing(1.5)}px;
`;

export { StyledPaper };
