import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFileRounded';
import InfoIcon from '@material-ui/icons/InfoRounded';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';

const StyledRow = styled(TableRow)`
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
  &:hover {
    background-color: ${(props) => props.theme.palette.hoverShadow.main};
  }
`;

// 24px the width of the directory arrow icon and is used to keep the file icon aligned with the directory icon
const IndentedDiv = styled.div`
  padding: 10px 40px;
  margin-left: ${(props) => props.theme.spacing(props.$depth * 1.5) + 24}px;
  display: flex;
  align-items: center;
`;

const StyledFileIcon = styled(InsertDriveFileIcon)`
  margin-right: ${(props) => props.theme.spacing(1)}px;
  font-size: ${(props) => props.theme.typography.body1.fontSize}px;
`;

const FileSize = styled(Typography)`
  margin-left: ${(props) => props.theme.spacing(1)}px;
`;

const StyledInfoIcon = styled(InfoIcon)`
  margin-left: ${(props) => props.theme.spacing(1)}px;
  font-size: 1rem;
`;

const QaChip = styled(Chip)`
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 8px;
`;

export { StyledRow, IndentedDiv, StyledFileIcon, FileSize, StyledInfoIcon, QaChip };
