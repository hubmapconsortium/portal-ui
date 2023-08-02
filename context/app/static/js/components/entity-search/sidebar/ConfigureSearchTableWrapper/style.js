import styled from 'styled-components';

import SearchBar from 'js/shared-styles/inputs/SearchBar';

const FlexGrow = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 0px;
`;

const StyledSearchBar = styled(SearchBar)`
  margin-bottom: ${(props) => props.theme.spacing(1)};
`;

export { FlexGrow, StyledSearchBar };
