import styled from 'styled-components';

const Flex = styled.div`
  display: flex;
`;

const ChartWrapper = styled.div`
  width: 1000px;
  height: 800px;
`;

const LegendWrapper = styled.div`
  margin-top: ${(props) => props.marginTop}px;
`;

export { Flex, ChartWrapper, LegendWrapper };
