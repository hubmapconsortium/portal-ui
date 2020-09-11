import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';

const FlexColumnRight = styled.div`
  display: flex;
  margin-left: auto;
  flex-direction: column;
  justify-content: space-evenly;
  white-space: nowrap;
`;

const StyledPaper = styled(Paper)`
  display: flex;
  min-height: 155px;
  padding: 30px 40px 30px 40px;
`;

export { FlexColumnRight, StyledPaper };
