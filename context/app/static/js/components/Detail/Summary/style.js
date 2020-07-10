import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';

const FlexContainer = styled.div`
  display: flex;
`;

const FlexCenterAlign = styled(FlexContainer)`
  align-items: center;
`;

const FlexColumn = styled(FlexContainer)`
  flex-direction: column;
`;

const FlexRight = styled.div`
  display: flex;
  margin-left: auto;
`;

const FlexBottomRight = styled(FlexRight)`
  align-items: flex-end;
`;

const FlexColumnRight = styled(FlexRight)`
  flex-direction: column;
  justify-content: space-evenly;
  white-space: nowrap;
`;

const StyledPaper = styled(Paper)`
  display: flex;
  min-height: 155px;
  padding: 30px 40px 30px 40px;
`;

export { FlexContainer, FlexCenterAlign, FlexColumn, FlexRight, FlexBottomRight, FlexColumnRight, StyledPaper };
