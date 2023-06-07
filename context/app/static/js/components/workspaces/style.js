import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import Description from 'js/shared-styles/sections/Description';

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

const StyledDescription = styled(Description)`
  margin-bottom: ${(props) => props.theme.spacing(2)};
  padding: ${(props) => props.theme.spacing(2.5)};
`;

export { StyledButton, LinkButton, Bold, StyledDescription };
