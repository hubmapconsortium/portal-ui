import { styled } from '@mui/styles';
import FolderIcon from '@mui/icons-material/FolderRounded';
import FolderOpenIcon from '@mui/icons-material/FolderOpenRounded';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: theme.palette.hoverShadow.main,
  },
  cursor: 'pointer',
}));

const Directory = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.25, 0, 1.25, 2),
  fontSize: theme.typography.body1.fontSize,
  display: 'flex',
  alignItems: 'center',
}));

const iconMargin = ({ theme }) => ({
  marginRight: theme.spacing(1),
});

const StyledFolderIcon = styled(FolderIcon)(iconMargin);

const StyledFolderOpenIcon = styled(FolderOpenIcon)(iconMargin);

export { StyledTableRow, Directory, StyledFolderOpenIcon, StyledFolderIcon };
