import styled from 'styled-components';

const SearchLayout = styled.div`
  display: flex;
`;

const ResultsLayout = styled.div`
  flex-grow: 1;
  min-width: 0; // needed for horizontal scrolling table
  display: flex;
  flex-direction: column;
`;

export { SearchLayout, ResultsLayout };
