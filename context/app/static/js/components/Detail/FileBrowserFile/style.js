import styled from 'styled-components';
import { LightBlueLink } from 'shared-styles/Links';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

const StyledTypography = styled(LightBlueLink)`
  text-decoration: none;
  padding: 10px 0px 10px ${(props) => props.theme.spacing((props.$level + 2) * 1.5)}px;
  border-bottom: 1px solid ${(props) => props.theme.palette.collectionsDivider.main};

  &:hover {
    background-color: rgb(0, 0, 0, 0.08);
  }
`;

const StyledFileIcon = styled(InsertDriveFileIcon)`
  margin-right: ${(props) => props.theme.spacing(1)}px;
`;

export { StyledTypography, StyledFileIcon };
