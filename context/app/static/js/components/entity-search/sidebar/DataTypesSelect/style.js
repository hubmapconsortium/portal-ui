import styled, { css } from 'styled-components';
import Paper from '@mui/material/Paper';
import FormLabel from '@mui/material/FormLabel';

import { buildScrollShadows } from 'js/shared-styles/scrollShadows';

const StyledPaper = styled(Paper)`
  min-width: 300px;
  padding: 16px 16px 16px 0px;
  overflow-y: auto;
  height: 100%;
  margin-right: ${(props) => props.theme.spacing(1.5)};
  ${buildScrollShadows()};
`;

const StyledFormLabel = styled(FormLabel)`
  ${({ theme: { typography, palette, spacing } }) => css`
    font-weight: ${typography.subtitle1.fontWeight};
    font-size: ${typography.subtitle1.fontSize};
    color: ${palette.text.primary};
    margin-left: ${spacing(2)};
    margin-bottom: ${spacing(0.5)};
  `}
`;

export { StyledPaper, StyledFormLabel };
