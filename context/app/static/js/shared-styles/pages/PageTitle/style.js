import styled, { css } from 'styled-components';
import Typography from '@material-ui/core/Typography';

const pageTitleBottomMargin = css`
  margin-bottom: ${(props) => props.theme.spacing(2)}px;
`;

const StyledTypography = styled(Typography)`
  ${pageTitleBottomMargin}
`;

export { StyledTypography, pageTitleBottomMargin };
