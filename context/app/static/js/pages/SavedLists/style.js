import styled from 'styled-components';
import { Alert } from 'js/shared-styles/alerts';

const SeparatedFlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.spacing(0.5)}px;
`;

const FlexBottom = styled.div`
  display: flex;
  align-items: flex-end;
`;

const StyledAlert = styled(Alert)`
  margin-bottom: ${(props) => props.theme.spacing(1.5)}px;
`;

export { SeparatedFlexRow, FlexBottom, StyledAlert };
