import styled from 'styled-components';
import FolderIcon from '@mui/icons-material/FolderRounded';
import FolderOpenIcon from '@mui/icons-material/FolderOpenRounded';
import TableRow from '@mui/material/TableRow';

const StyledTableRow = styled(TableRow)`
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
  &:hover {
    background-color: ${(props) => props.theme.palette.hoverShadow.main};
  }
  cursor: pointer;
`;

const Directory = styled.div`
  padding: 10px 0px 10px 16px;
  margin-left: ${(props) => props.theme.spacing(4 * props.$depth)};
  font-size: ${(props) => props.theme.typography.body1.fontSize};
  display: flex;
  align-items: center;
`;

const StyledFolderIcon = styled(FolderIcon)`
  margin-right: ${(props) => props.theme.spacing(1)};
`;

const StyledFolderOpenIcon = styled(FolderOpenIcon)`
  margin-right: ${(props) => props.theme.spacing(1)};
`;

export { StyledTableRow, Directory, StyledFolderOpenIcon, StyledFolderIcon };
