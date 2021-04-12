import styled from 'styled-components';

const Flex = styled.div`
  display: flex;
  height: 100%;
`;

const CallToActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    width: 400px;
    flex-shrink: 0;
  }
`;

export { Flex, CallToActionWrapper };
