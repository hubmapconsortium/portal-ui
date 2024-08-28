import { styled } from '@mui/material/styles';
import FolderIcon from '@mui/icons-material/FolderRounded';
import FolderOpenIcon from '@mui/icons-material/FolderOpenRounded';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: theme.palette.common.hoverShadow,
  },
  cursor: 'pointer',
}));

const Directory = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.25, 0, 1.25, 2),
  fontSize: theme.typography.body1.fontSize,
  display: 'flex',
  alignItems: 'center',
}));

const withIconStyles = (Icon: typeof SvgIcon) =>
  styled(Icon)(({ theme }) => ({
    marginRight: theme.spacing(1),
  }));

const StyledFolderIcon = withIconStyles(FolderIcon);

const StyledFolderOpenIcon = withIconStyles(FolderOpenIcon);

export { StyledTableRow, Directory, StyledFolderOpenIcon, StyledFolderIcon };
