import styled from 'styled-components';

const FlexRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;

  @media (max-width: ${(props) => props.theme.breakpoints.values.sm}px) {
    flex-direction: column;
  }
`;

export { FlexRow };
