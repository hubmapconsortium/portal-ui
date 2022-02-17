import styled from 'styled-components';

const SearchLayout = styled.div`
  display: flex;
`;

const SidebarLayout = styled.div`
  width: 20%;
  margin-right: ${(props) => props.theme.spacing(2)}px;
`;

const ResultsLayout = styled.div`
  flex-grow: 1;
`;

export { SearchLayout, SidebarLayout, ResultsLayout };
