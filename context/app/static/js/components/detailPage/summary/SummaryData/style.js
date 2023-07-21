import styled from 'styled-components';
import Typography from '@mui/material/Typography';

import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';

const FlexEnd = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
`;

const JsonButton = styled(WhiteBackgroundIconButton)`
  height: 36px;
`;

const StyledTypography = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing(0.5)};
`;

export { FlexEnd, JsonButton, StyledTypography };
