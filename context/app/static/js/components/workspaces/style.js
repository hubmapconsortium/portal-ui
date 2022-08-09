import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
// Copy-and-paste from js/components/savedLists/SavedListScrollbox/style.js

// TODO: Copy-and-paste from SummaryData/style
const StyledButton = styled(WhiteBackgroundIconButton)`
  height: 36px;
`;

const LinkButton = styled.button`
  all: unset;
  cursor: pointer;
`;

const Bold = styled(Typography)`
  font-weight: bold;
`;

export { StyledButton, LinkButton, Bold };
