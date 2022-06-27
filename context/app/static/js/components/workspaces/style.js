import styled from 'styled-components';

import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
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

// TODO: Copy-and-paste from SummaryData/style
const StyledButton = styled(WhiteBackgroundIconButton)`
  height: 36px;
`;

export { SeparatedFlexRow, FlexBottom, StyledButton };
