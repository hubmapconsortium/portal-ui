import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';

const FlexEnd = styled.div`
  display: flex;
  align-items: flex-end;
`;

const JsonButton = styled(WhiteBackgroundIconButton)`
  margin-left: auto;
`;

const StyledTypography = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing(0.5)}px;
`;

export { FlexEnd, JsonButton, StyledTypography };
