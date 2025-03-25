import { Theme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TableHead from '@mui/material/TableHead';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';

import { HeaderCell } from 'js/shared-styles/tables';
import NumSelectedHeader from 'js/shared-styles/tables/NumSelectedHeader';
import { SvgIcon } from '@mui/material';

const border = (theme: Theme) => ({
  border: `1px solid ${theme.palette.grey[300]}`,
});

const ChipWrapper = styled('div')(({ theme }) => ({
  ...border(theme),
  borderTop: 'none',
  position: 'sticky',
  display: 'flex',
  top: 0,
  padding: theme.spacing(1.5, 2),
  gap: theme.spacing(1),
  zIndex: theme.zIndex.fileBrowserHeader,
  backgroundColor: theme.palette.white.main,
}));

const StyledTable = styled(Table)(({ theme }) => ({
  backgroundColor: theme.palette.white.main,
  boxShadow: theme.shadows[1],
  tableLayout: 'auto',
}));

const StyledTableBody = styled(TableBody)({
  width: '100%',
  overflowY: 'auto',
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.white.main,
}));

const BorderedTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.white.main,
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
}));

const CompactTableRow = styled(StyledTableRow)(({ theme }) => ({
  td: {
    paddingY: theme.spacing(1.25),
  },
  border: 'none',
}));

const ExpandedTableRow = styled(StyledTableRow)({
  paddingBottom: 0,
  paddingTop: 0,
  border: 'none',
});

const StyledTableCell = styled(TableCell)({
  em: {
    fontWeight: 'bold',
    fontStyle: 'normal',
  },
});

const ExpandedTableCell = styled(StyledTableCell)(({ theme }) => ({
  paddingBottom: 0,
  paddingTop: 0,
  paddingLeft: theme.spacing(1),
  borderTop: 'none',
}));

const StyledDescriptionContainer = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
  paddingBottom: theme.spacing(1.5),
  paddingTop: theme.spacing(0.5),
}));

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
  ...border(theme),
  borderTop: 'none',
  width: '100%',
  overflowY: 'auto',
  overflowX: 'hidden',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  ...border(theme),
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.fileBrowserHeader,
  background: theme.palette.white.main,
}));

const StyledNumSelectedHeader = styled(NumSelectedHeader)(({ theme }) => ({
  ...border(theme),
}));

const StyledSvgIcon = styled(SvgIcon)({
  fontSize: '1.5rem',
});

export {
  ChipWrapper,
  CompactTableRow,
  ExpandedTableCell,
  ExpandedTableRow,
  StyledHeaderCell,
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledButton,
  StyledTableContainer,
  StyledTableRow,
  StyledTableHead,
  StyledCheckboxCell,
  StyledNumSelectedHeader,
  StyledSvgIcon,
  BorderedTableRow,
  StyledDescriptionContainer,
};
