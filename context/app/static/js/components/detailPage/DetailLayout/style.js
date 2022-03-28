import styled from 'styled-components';
import { entityHeaderHeight } from 'js/components/detailPage/entityHeader/EntityHeader';

const Content = styled.div`
  width: calc(100% - 150px);
`;

const StyledDiv = styled.div`
  margin-top: ${(props) => props.theme.spacing(2) + entityHeaderHeight}px;
`;

const FlexRow = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing(5)}px;
`;

export { Content, FlexRow, StyledDiv };
