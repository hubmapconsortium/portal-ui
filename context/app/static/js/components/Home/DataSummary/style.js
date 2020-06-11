import styled from 'styled-components';

const FlexRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
  margin-top: ${(props) => props.theme.spacing(2)}px;
  margin-bottom: ${(props) => props.theme.spacing(2)}px;

  @media (max-width: ${(props) => props.theme.breakpoints.values.sm}px) {
    flex-direction: column;
  }
`;

export { FlexRow };
