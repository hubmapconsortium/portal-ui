import styled from 'styled-components';

const Content = styled.div`
  width: calc(100% - 150px);
`;

const FlexRow = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing(5)}px;
`;

export { Content, FlexRow };
