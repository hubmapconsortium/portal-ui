import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const StyledPaper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(2)};
`;

const StyledTypography = styled(Typography)`
  margin-top: ${(props) => props.theme.spacing(props.mt)};
`;

export { StyledPaper, StyledTypography };
