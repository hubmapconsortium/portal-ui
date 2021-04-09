import styled from 'styled-components';

const Flex = styled.div`
  display: flex;
  max-height: 1064px;
`;

const CallToActionWrapper = styled.div`
  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    min-width: 400px;
  }
  width: 100%;
`;

export { Flex, CallToActionWrapper };
