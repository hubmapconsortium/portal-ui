import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';

const SearchLayout = styled.div`
  display: flex;
`;

const SidebarLayout = styled(Paper)`
  width: 20%;
  margin-right: ${(props) => props.theme.spacing(2)}px;
`;

const ResultsLayout = styled.div`
  flex-grow: 1;
`;

export { SearchLayout, SidebarLayout, ResultsLayout };
