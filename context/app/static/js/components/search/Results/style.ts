import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import ArrowUpward from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownward from '@mui/icons-material/ArrowDownwardRounded';

import { HeaderCell } from 'js/shared-styles/tables';

const StyledTable = styled(Table)(({ theme }) => ({
  backgroundColor: theme.palette.white.main,
  boxShadow: theme.shadows[1],
}));

const StyledTableBody = styled(TableBody)(({ theme }) => ({
  // NOTE: If we want to darken on hover, we need to give an explicit background to all rows.
  // What looks white is actually transparent and brightness() has no effect.
  backgroundColor: theme.palette.white.main,

  '&:hover': {
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

const sharedArrowStyles = {
  verticalAlign: 'text-top',
  fontSize: '1.1rem',
};

const ArrowUpOn = styled(ArrowUpward)({
  ...sharedArrowStyles,
});

const ArrowDownOn = styled(ArrowDownward)({
  ...sharedArrowStyles,
});

const ArrowDownOff = styled(ArrowDownward)({
  ...sharedArrowStyles,
  opacity: '12%',
});

const StyledHeaderCell = styled(HeaderCell)({
  cursor: 'pointer',
  whiteSpace: 'nowrap',
});

export {
  StyledTable,
  StyledTableRow,
  StyledTableBody,
  StyledTableCell,
  ArrowUpOn,
  ArrowDownOn,
  ArrowDownOff,
  StyledHeaderCell,
};
