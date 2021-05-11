import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';

const FlexPaper = styled(Paper)`
  padding: 30px 40px;
`;

const Flex = styled.div`
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing(0.5)}px;
`;

const FlexRight = styled.div`
  display: flex;
  margin-left: auto;
`;

export { FlexPaper, Flex, FlexRight };
