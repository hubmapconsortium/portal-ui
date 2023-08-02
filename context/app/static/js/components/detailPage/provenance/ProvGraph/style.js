import styled from 'styled-components';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const StyledPaper = styled(Paper)`
  padding: 30px 40px 30px 40px;
`;

const Flex = styled.div`
  display: flex;
`;

const StyledTypography = styled(Typography)`
  margin-top: ${(props) => props.theme.spacing(2)};
`;

const maxGraphHeight = 500;
const StyledDiv = styled.div`
  .scroll-container-wrapper {
    max-height: ${maxGraphHeight}px;
  }
`;

export { StyledPaper, Flex, StyledTypography, StyledDiv, maxGraphHeight };
