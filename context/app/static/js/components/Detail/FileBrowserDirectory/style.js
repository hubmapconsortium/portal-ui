import styled from 'styled-components';
import FolderIcon from '@material-ui/icons/Folder';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';

const Directory = styled.div`
  padding: 10px 0px 10px ${(props) => props.theme.spacing(props.$level * 1.5) + props.theme.spacing(3)}px;
  border-bottom: 1px solid ${(props) => props.theme.palette.collectionsDivider.main};
  font-size: ${(props) => props.theme.typography.body1.fontSize};
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background-color: rgb(0, 0, 0, 0.08);
  }
`;

const StyledFolderIcon = styled(FolderIcon)`
  margin-right: ${(props) => props.theme.spacing(1)}px;
`;

const StyledFolderOpenIcon = styled(FolderOpenIcon)`
  margin-right: ${(props) => props.theme.spacing(1)}px;
`;

export { Directory, StyledFolderOpenIcon, StyledFolderIcon };
