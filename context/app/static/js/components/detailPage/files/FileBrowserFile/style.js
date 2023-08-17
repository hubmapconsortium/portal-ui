import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFileRounded';
import InfoIcon from '@mui/icons-material/InfoRounded';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';

const StyledRow = styled(TableRow)`
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
  &:hover {
    background-color: ${(props) => props.theme.palette.hoverShadow.main};
  }
`;

const StyledFileIcon = styled(InsertDriveFileIcon)`
  margin-right: ${(props) => props.theme.spacing(1)};
  font-size: ${(props) => props.theme.typography.body1.fontSize}px;
`;

const FileSize = styled(Typography)`
  margin-left: ${(props) => props.theme.spacing(1)};
`;

const StyledInfoIcon = styled(InfoIcon)`
  margin-left: ${(props) => props.theme.spacing(1)};
  font-size: 1rem;
`;

const FileTypeChip = styled(Chip)(({ theme }) => ({
  px: theme.spacing(2),
  py: theme.spacing(1),
  borderRadius: theme.spacing(1),
  '&:not(:first-child)': {
    marginLeft: theme.spacing(1),
  },
}));

export { StyledRow, StyledFileIcon, FileSize, StyledInfoIcon, FileTypeChip };
