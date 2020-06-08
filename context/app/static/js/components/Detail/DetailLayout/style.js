import styled from 'styled-components';

const FlexColumn = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  width: calc(100% - 150px);
`;

const FlexRow = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
`;

export { FlexColumn, FlexRow };
