import styled from 'styled-components';

const Flex = styled.div`
  display: flex;
  flex-direction: column-reverse;
  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    height: 100%;
    flex-direction: row;
  }
`;

const CallToActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (min-width: ${(props) => props.theme.breakpoints.values.md}px) {
    width: 400px;
    flex-shrink: 0;
    justify-content: space-between;
    align-items: flex-start;
  }
`;

export { Flex, CallToActionWrapper };
