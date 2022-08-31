import styled from 'styled-components';

const Flex = styled.div`
  display: flex;
  min-width: 0;
`;

const StyledDiv = styled.div`
  min-width: 0;
`;

const BodyWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: ${(props) => props.$thumbmailDimension}px;
  box-sizing: content-box;
`;

export { Flex, StyledDiv, BodyWrapper };
