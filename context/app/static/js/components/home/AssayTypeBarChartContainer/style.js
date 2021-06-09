import styled from 'styled-components';

const Flex = styled.div`
  display: flex;
`;

const ChartWrapper = styled.div`
  flex-grow: 1;
  max-width: 1000px;
  width: 0px;
  height: 500px;
`;

const LegendWrapper = styled.div`
  margin-top: ${(props) => props.marginTop}px;
`;

export { Flex, ChartWrapper, LegendWrapper };
