import styled from 'styled-components';
import IconTooltipCell from 'js/shared-styles/tables/IconTooltipCell';

const StyledIconTooltipCell = styled(IconTooltipCell)`
  width: 100%; // The cell will take up table's remaining width.
`;

const NoWrapIconTooltipCell = styled(IconTooltipCell)`
  white-space: nowrap;
`;

export { StyledIconTooltipCell, NoWrapIconTooltipCell };
