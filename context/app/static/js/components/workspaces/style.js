import styled from 'styled-components';

import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
// Copy-and-paste from js/components/savedLists/SavedListScrollbox/style.js

// TODO: Copy-and-paste from SummaryData/style
const StyledButton = styled(WhiteBackgroundIconButton)`
  height: 36px;
`;

const Left = styled.div`
  flex-shrink: 0;
`;
const Right = styled.div`
  flex-shrink: 0;
`;

export { StyledButton, Left, Right };
