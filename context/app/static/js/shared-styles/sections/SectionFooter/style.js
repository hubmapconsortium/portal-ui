import styled, { css } from 'styled-components';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';

import Typography from '@material-ui/core/Typography';

const StyledTypography = styled(Typography)`
  display: flex;
  align-items: center;
`;

const StyledDivider = styled(Divider)`
  ${({ theme: { spacing, palette } }) => css`
    margin: 0 ${spacing(1)}px;
    background-color: ${palette.primary.main};
  `}
`;

const StyledPaper = styled(Paper)`
  display: flex;
  align-items: center;
  justify-content: end;
  ${({ theme: { spacing, palette } }) => css`
    padding: 0 ${spacing(2)}px;
    background-color: ${palette.caption.background};
    min-height: ${spacing(3)}px;
  `}
  border-radius: 0px 0px 4px 4px;
`;

export { StyledDivider, StyledPaper, StyledTypography };
