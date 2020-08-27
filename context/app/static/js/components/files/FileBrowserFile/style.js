import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFileRounded';
import InfoIcon from '@material-ui/icons/InfoRounded';

const StyledDiv = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.palette.collectionsDivider.main};

  &:hover {
    background-color: rgb(0, 0, 0, 0.08);
  }
`;

const IndentedDiv = styled.div`
  padding: 10px 40px;
  margin-left: ${(props) => props.theme.spacing(props.$depth * 1.5)}px;
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

export { StyledDiv, IndentedDiv, StyledFileIcon, FileSize, StyledInfoIcon };
