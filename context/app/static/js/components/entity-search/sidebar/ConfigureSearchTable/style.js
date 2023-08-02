import styled from 'styled-components';
import TableContainer from '@mui/material/TableContainer';

import IconTooltipCell from 'js/shared-styles/tables/IconTooltipCell';

import { buildStickyTableScrollShadows } from 'js/shared-styles/scrollShadows';

const StyledIconTooltipCell = styled(IconTooltipCell)`
  width: 100%; // The cell will take up table's remaining width.
`;

const NoWrapIconTooltipCell = styled(IconTooltipCell)`
  white-space: nowrap;
`;

const StyledTableContainer = styled(TableContainer)`
  ${(props) => buildStickyTableScrollShadows(props.$tableHeadHeight)}
`;

export { StyledIconTooltipCell, NoWrapIconTooltipCell, StyledTableContainer };
