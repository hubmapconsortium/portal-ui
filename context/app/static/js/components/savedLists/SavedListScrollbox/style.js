import styled from 'styled-components';

import { PanelScrollBox } from 'js/shared-styles/panels';

const SeparatedFlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.spacing(0.5)};
`;

const FlexBottom = styled.div`
  display: flex;
  align-items: flex-end;
`;

const MaxHeightScrollbox = styled(PanelScrollBox)`
  max-height: 415px;
`;
export { SeparatedFlexRow, FlexBottom, MaxHeightScrollbox };
