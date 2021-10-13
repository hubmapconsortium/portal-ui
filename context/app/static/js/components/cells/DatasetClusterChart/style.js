import styled from 'styled-components';

const Flex = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

const FlexGrowChild = styled.div`
  flex-grow: 1;
  min-height: 0px;
`;

export { Flex, FlexGrowChild };
