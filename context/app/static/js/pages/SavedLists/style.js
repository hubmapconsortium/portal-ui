import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

import { Alert } from 'js/shared-styles/alerts';

const StyledAlert = styled(Alert)`
  margin-bottom: ${(props) => props.theme.spacing(1.5)}px;
`;

const SpacingDiv = styled.div`
  margin-bottom: ${(props) => props.theme.spacing(2)}px;
`;

const StyledHeader = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
`;

export { StyledAlert, SpacingDiv, StyledHeader };
