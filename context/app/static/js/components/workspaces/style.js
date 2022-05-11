import styled from 'styled-components';

// Copy-and-paste from js/components/savedLists/SavedListScrollbox/style.js
// TODO: Maybe there are shared styles that are better to use?

const SeparatedFlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.spacing(0.5)}px;
`;

const FlexBottom = styled.div`
  display: flex;
  align-items: flex-end;
`;

export { SeparatedFlexRow, FlexBottom };
