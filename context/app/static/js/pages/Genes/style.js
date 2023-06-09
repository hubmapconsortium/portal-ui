import styled from 'styled-components';

const FlexRow = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing(5)}px;
`;

const Content = styled.div`
  width: calc(100% - 150px);
`;

export { FlexRow, Content };
