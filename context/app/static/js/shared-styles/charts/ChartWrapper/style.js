import styled from 'styled-components';

const Flex = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

const DropdownWrapper = styled.div`
  margin-bottom: ${(props) => props.theme.spacing(1)};
  max-width: 175px;
  min-width: 0px;
`;

const FlexGrowChild = styled.div`
  flex-grow: 1;
  min-height: 0px;
  min-width: 0px;
`;

const DropdownAndLegendWrapper = styled.div`
  margin-top: ${(props) => props.$topOffset}px;
`;

export { Flex, DropdownWrapper, FlexGrowChild, DropdownAndLegendWrapper };
