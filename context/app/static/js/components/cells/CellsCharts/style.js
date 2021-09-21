import styled from 'styled-components';
import Skeleton from '@material-ui/lab/Skeleton';

const Flex = styled.div`
  display: flex;
  height: 400px;
`;

const ChartWrapper = styled.div`
  flex-basis: 50%;
  height: 100%;
  box-sizing: border-box;
  margin: 0px 10px;
`;
const StyledSkeleton = styled(Skeleton)`
  height: 100%;
  width: 100%;
`;

export { Flex, ChartWrapper, StyledSkeleton };
