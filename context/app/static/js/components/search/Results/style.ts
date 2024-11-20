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
  tableLayout: 'auto',
}));

const StyledTableBody = styled(TableBody)({
  borderLeft: 'none',
  borderRight: 'none',
});

const interPadding = '.6rem';
const sidePadding = '4rem';

const StyledTableRow = styled(TableRow)<{ $beforeHighlight?: boolean; $highlight?: boolean }>(
  ({ theme, $beforeHighlight, $highlight }) => ({
    border: `1px solid ${theme.palette.divider}`,

    // NOTE: If we want to darken on hover, we need to give an explicit background to all rows.
    // What looks white is actually transparent and brightness() has no effect.
    backgroundColor: theme.palette.white.main,

    '&:hover': {
      filter: theme.palette.white.hover,
    },
    ...($beforeHighlight && {
      borderBottom: 'none',
      td: {
        paddingBottom: 0,
      },
      '&:hover + tr': {
        filter: theme.palette.white.hover,
      },
      ':has(+ &:hover)': {
        filter: theme.palette.white.hover,
      },
    }),

    ...($highlight && {
      borderTop: 'none',
      td: {
        paddingTop: interPadding,
        paddingLeft: sidePadding,
        paddingRight: sidePadding,
        color: theme.palette.common.halfShadow,
        margin: 0,
      },
    }),
  }),
);

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
} as const;

const ArrowUpOn = styled(ArrowUpward)(sharedArrowStyles);

const ArrowDownOn = styled(ArrowDownward)(sharedArrowStyles);

const ArrowDownOff = styled(ArrowDownward)({
  ...sharedArrowStyles,
  opacity: '40%',
});

const StyledHeaderCell = styled(HeaderCell)({
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
