import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFileRounded';
import InfoIcon from '@mui/icons-material/InfoRounded';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';

const StyledRow = styled(TableRow)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: theme.palette.common.hoverShadow,
  },
}));

const StyledFileIcon = styled(InsertDriveFileIcon)(({ theme }) => ({
  marginRight: theme.spacing(1),
  fontSize: theme.typography.body1.fontSize,
}));

const FileSize = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const StyledInfoIcon = styled(InfoIcon)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  fontSize: '1rem',
}));

const FileTypeChip = styled(Chip)(({ theme }) => ({
  px: theme.spacing(2),
  py: theme.spacing(1),
  borderRadius: theme.spacing(1),
  '&:not(:first-child)': {
    marginLeft: theme.spacing(1),
  },
}));

export { StyledRow, StyledFileIcon, FileSize, StyledInfoIcon, FileTypeChip };
