import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';

const StyledPaper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(2)}px ${(props) => props.theme.spacing(0.5)}px;
  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    padding: ${(props) => props.theme.spacing(2)}px;
  }
`;

export { StyledPaper };
