import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';

const StyledTable = styled(Table)(({ theme }) => ({
  backgroundColor: theme.palette.white.main,
  boxShadow: theme.shadows[1],
}));

const StyledTableBody = styled(TableBody)(({ theme }) => ({
  backgroundColor: theme.palette.white.main,
  // NOTE: If we want to darken on hover, we need to give an explicit background to all rows.
  // What looks white is actually transparent and brightness() has no effect.
  ':hover': {
    filter: theme.palette.white.hover,
  },

  // Material would apply this on TD, but we override, so there is no internal border above the highlight.
  border: `1px solid ${theme.palette.divider}`,
  borderLeft: 'none',
  borderRight: 'none',
}));

const interPadding = `${16 * 0.6}px`;
const sidePadding = '64px';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  border: 0,
  '&.before-highlight td': {
    paddingBottom: 0,
  },
  '&.highlight td': {
    paddingTop: interPadding,
    paddingLeft: sidePadding,
    paddingRight: sidePadding,
    '& p': {
      color: theme.palette.common.halfShadow,
      margin: 0,
    },
  },
}));

const StyledTableCell = styled(TableCell)({
  // Borders handled by tbody.
  border: 'none',

  // Elastic search injects <em> when showing matches in context.
  em: {
    fontWeight: 'bold',
    fontStyle: 'normal',
  },
});

export { StyledTable, StyledTableRow, StyledTableBody, StyledTableCell };
