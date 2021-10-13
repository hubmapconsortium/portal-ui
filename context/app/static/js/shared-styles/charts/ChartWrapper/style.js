import styled from 'styled-components';

const TitleWrapper = styled.div`
  padding-left: ${(props) => props.$leftOffset}px;
`;

const Flex = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

const FlexGrowChild = styled.div`
  flex-grow: 1;
  min-height: 0px;
`;

export { TitleWrapper, Flex, FlexGrowChild };
