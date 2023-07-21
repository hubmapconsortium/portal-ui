import styled, { css } from 'styled-components';
import Typography from '@mui/material/Typography';

const pageTitleBottomMargin = css`
  margin-bottom: ${(props) => props.theme.spacing(2)};
`;

const StyledTypography = styled(Typography)`
  ${pageTitleBottomMargin}
`;

export { StyledTypography, pageTitleBottomMargin };
