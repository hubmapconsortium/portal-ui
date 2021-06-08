import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import SectionItem from '../SectionItem';

const FlexColumnRight = styled.div`
  display: flex;
  margin-left: auto;
  flex-direction: column;
  white-space: nowrap;
  padding-left: ${(props) => props.theme.spacing(1)}px;
`;

const StyledPaper = styled(Paper)`
  display: flex;
  min-height: 155px;
  padding: 30px 40px 30px 40px;
`;

const StyledSectionItem = styled(SectionItem)`
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
`;

export { FlexColumnRight, StyledPaper, StyledSectionItem };
