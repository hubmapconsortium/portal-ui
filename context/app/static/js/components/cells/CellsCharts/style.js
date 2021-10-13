import styled, { css } from 'styled-components';
import Typography from '@material-ui/core/Typography';

const chartMargin = css`
  margin: 0px 10px;
`;

const Flex = styled.div`
  display: flex;
  height: 400px;
`;

const StyledTypography = styled(Typography)`
  ${chartMargin}
`;

const ChartWrapper = styled.div`
  flex-basis: ${(props) => props.$flexBasis}%;
  height: 100%;
  box-sizing: border-box;
  ${chartMargin}
  width: 0px;
`;

export { Flex, ChartWrapper, StyledTypography };
