import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';

const FlexPaper = styled(Paper)`
  display: flex;
  padding: 30px 40px 30px 40px;
`;

const Pre = styled.pre`
  font-size: 12px;
  white-space: pre-wrap;
`;

export { FlexPaper, Pre };
