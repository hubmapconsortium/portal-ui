import styled from 'styled-components';
import FolderIcon from '@material-ui/icons/FolderRounded';
import FolderOpenIcon from '@material-ui/icons/FolderOpenRounded';
import TableRow from '@material-ui/core/TableRow';

const StyledTableRow = styled(TableRow)`
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
  &:hover {
    background-color: ${(props) => props.theme.palette.hoverShadow.main};
  }
  cursor: pointer;
`;

const Directory = styled.div`
  padding: 10px 0px 10px ${(props) => props.theme.spacing(props.$depth * 1.5) + 40}px;
  font-size: ${(props) => props.theme.typography.body1.fontSize};
  display: flex;
  align-items: center;
`;

const StyledFolderIcon = styled(FolderIcon)`
  margin-right: ${(props) => props.theme.spacing(1)}px;
`;

const StyledFolderOpenIcon = styled(FolderOpenIcon)`
  margin-right: ${(props) => props.theme.spacing(1)}px;
`;

export { StyledTableRow, Directory, StyledFolderOpenIcon, StyledFolderIcon };
