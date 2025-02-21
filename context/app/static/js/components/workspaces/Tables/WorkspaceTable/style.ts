import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import ArrowUpward from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownward from '@mui/icons-material/ArrowDownwardRounded';

import { HeaderCell } from 'js/shared-styles/tables';
import { Box, Button, TableHead } from '@mui/material';

const ChipWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  position: 'sticky',
  top: 0,
  backgroundColor: theme.palette.white.main,
  zIndex: theme.zIndex.fileBrowserHeader,
  display: 'flex',
  gap: theme.spacing(1),
  border: `1px solid ${theme.palette.grey[300]}`,
  borderTop: 'none',
}));

const StyledTable = styled(Table)(({ theme }) => ({
  backgroundColor: theme.palette.white.main,
  boxShadow: theme.shadows[1],
  tableLayout: 'auto',
}));

const StyledTableBody = styled(TableBody)({
  border: 'none',
  width: '100%',
  maxHeight: '400px',
  overflowY: 'auto',
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.white.main,
  border: `1px solid ${theme.palette.grey[300]}`,
  borderBottom: 'none',
}));

const CompactTableRow = styled(StyledTableRow)(({ theme }) => ({
  td: {
    padding: theme.spacing(1),
  },
  borderBottom: 'none',
}));

const ExpandedTableRow = styled(StyledTableRow)({
  paddingBottom: 0,
  paddingTop: 0,
  borderTop: 'none',
});

const StyledTableCell = styled(TableCell)({
  border: 'none',
  em: {
    fontWeight: 'bold',
    fontStyle: 'normal',
  },
});

const ExpandedTableCell = styled(StyledTableCell)(({ theme }) => ({
  paddingBottom: 0,
  paddingTop: 0,
  paddingLeft: theme.spacing(1),
}));

const sharedArrowStyles = {
  verticalAlign: 'text-top',
  fontSize: '1rem',
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

const StyledCheckboxCell = styled(StyledTableCell)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: theme.spacing(1.25),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primaryContainer.contrastText,
  backgroundColor: theme.palette.primaryContainer.main,
}));

const StyledTableContainer = styled(Box)(({ theme }) => ({
  maxHeight: '400px',
  width: '100%',
  border: `1px solid ${theme.palette.grey[300]}`,
  borderTop: 'none',
  borderLeft: 'none',
  overflowY: 'auto',
  overflowX: 'hidden',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.fileBrowserHeader,
  background: theme.palette.white.main,
}));

const StyledLaunchButton = styled(Button)(({ theme }) => ({
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: theme.spacing(0.5),
  padding: theme.spacing(1, 3),
}));

export {
  ChipWrapper,
  StyledTable,
  StyledTableRow,
  StyledTableBody,
  StyledTableCell,
  ArrowUpOn,
  ArrowDownOn,
  ArrowDownOff,
  StyledHeaderCell,
  CompactTableRow,
  ExpandedTableRow,
  ExpandedTableCell,
  StyledButton,
  StyledTableContainer,
  StyledTableHead,
  StyledLaunchButton,
  StyledCheckboxCell,
};
