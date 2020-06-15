import styled from 'styled-components';

const Wrapper = styled.div`
  grid-area: data;
`;

const FlexRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  min-height: 80px;
  @media (max-width: ${(props) => props.theme.breakpoints.values.sm}px) {
    flex-direction: column;
  }
`;

export { Wrapper, FlexRow };
