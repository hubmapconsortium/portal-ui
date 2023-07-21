import styled from 'styled-components';
import { Alert } from 'js/shared-styles/alerts';

const Content = styled.div`
  width: calc(100% - 150px);
`;

const FlexRow = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  margin-bottom: ${(props) => props.theme.spacing(5)};
`;

const StyledAlert = styled(Alert)`
  margin-bottom: ${(props) => props.theme.spacing(1.5)};
`;

export { Content, FlexRow, StyledAlert };
