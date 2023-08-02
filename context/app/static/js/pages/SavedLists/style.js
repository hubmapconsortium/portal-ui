import styled from 'styled-components';
import Typography from '@mui/material/Typography';

import { Alert } from 'js/shared-styles/alerts';

const StyledAlert = styled(Alert)`
  margin-bottom: ${(props) => props.theme.spacing(1.5)};
`;

const SpacingDiv = styled.div`
  margin-bottom: ${(props) => props.theme.spacing(3)};
`;

const StyledHeader = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing(1)};
`;

const PageSpacing = styled.div`
  margin-bottom: ${(props) => props.theme.spacing(5)};
`;

export { StyledAlert, SpacingDiv, StyledHeader, PageSpacing };
