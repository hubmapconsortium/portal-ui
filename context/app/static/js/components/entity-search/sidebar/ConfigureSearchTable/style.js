import styled from 'styled-components';
import IconTooltipCell from 'js/shared-styles/tables/IconTooltipCell';
import TableCell from '@material-ui/core/TableCell';

const StyledIconTooltipCell = styled(IconTooltipCell)`
  width: 100%; // The cell will take up table's remaining width.
`;

const NoWrapTableCell = styled(TableCell)`
  white-space: nowrap;
`;

export { StyledIconTooltipCell, NoWrapTableCell };
