import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const StyledPaper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(2)}px;
`;

const StyledTypography = styled(Typography)`
  margin-top: ${(props) => props.theme.spacing(props.mt)}px;
`;

export { StyledPaper, StyledTypography };
