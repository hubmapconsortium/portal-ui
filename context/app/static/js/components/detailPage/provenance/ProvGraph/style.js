import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const StyledPaper = styled(Paper)`
  padding: 30px 40px 30px 40px;
`;

const Flex = styled.div`
  display: flex;
`;

const StyledTypography = styled(Typography)`
  margin-top: ${(props) => props.theme.spacing(2)}px;
`;

const maxGraphHeight = 500;
const ScrollDiv = styled.div`
  max-height: ${maxGraphHeight}px;
  overflow-x: auto;
  overflow-y: auto;
  .scroll-container-wrapper {
    overflow: visible !important; // Override react-workflow-viz styles.
  }
`;

export { StyledPaper, Flex, StyledTypography, ScrollDiv, maxGraphHeight };
