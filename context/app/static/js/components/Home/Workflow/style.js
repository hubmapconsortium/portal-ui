import styled from 'styled-components';

const Flex = styled.div`
  grid-area: workflow;
  display: flex;
  align-items: center;
  min-height: 272px;
  @media (max-width: ${(props) => props.theme.breakpoints.values.sm}px) {
    flex-direction: column;
  }
`;

export { Flex };
