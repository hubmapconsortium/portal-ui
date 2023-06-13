import styled, { css } from 'styled-components';
// NOTE: We are using the rounded icon variants consistently.
import BubbleChartIcon from '@material-ui/icons/BubbleChartRounded';
import PersonIcon from '@material-ui/icons/PersonRounded';
import TableChartIcon from '@material-ui/icons/TableChartRounded';
import AccountBalanceIcon from '@material-ui/icons/AccountBalanceRounded';
import LaunchRoundedIcon from '@material-ui/icons/LaunchRounded';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import InsertDriveFileRoundedIcon from '@material-ui/icons/InsertDriveFileRounded';
import ErrorRoundedIcon from '@material-ui/icons/ErrorRounded';
import MoreHorizRoundedIcon from '@material-ui/icons/MoreHorizRounded';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import CollectionsBookmarkRoundedIcon from '@material-ui/icons/CollectionsBookmarkRounded';
import EmailRoundedIcon from '@material-ui/icons/EmailRounded';
import ListAltRoundedIcon from '@material-ui/icons/ListAltRounded';
import ArrowDropDownRoundedIcon from '@material-ui/icons/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@material-ui/icons/ArrowDropUpRounded';
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import RefreshIcon from '@material-ui/icons/Refresh';

const fontSizeStyle = css`
  font-size: ${(props) => props.$fontSize || '1rem'};
`;

const CenterIcon = styled(AccountBalanceIcon)`
  ${fontSizeStyle};
`;

const CollectionIcon = styled(CollectionsBookmarkRoundedIcon)`
  ${fontSizeStyle};
`;

const DonorIcon = styled(PersonIcon)`
  ${fontSizeStyle};
`;

const SampleIcon = styled(BubbleChartIcon)`
  ${fontSizeStyle};
`;

const DatasetIcon = styled(TableChartIcon)`
  ${fontSizeStyle};
`;

const PublicationIcon = styled(DescriptionOutlinedIcon)`
  ${fontSizeStyle}
`;

const ExternalLinkIcon = styled(LaunchRoundedIcon)`
  ${fontSizeStyle};
`;

const InfoIcon = styled(InfoRoundedIcon)`
  ${fontSizeStyle};
`;

const SuccessIcon = styled(CheckCircleRoundedIcon)`
  ${fontSizeStyle};
`;

const FileIcon = styled(InsertDriveFileRoundedIcon)`
  ${fontSizeStyle};
`;

const ErrorIcon = styled(ErrorRoundedIcon)`
  ${fontSizeStyle};
`;

const MoreIcon = styled(MoreHorizRoundedIcon)`
  ${fontSizeStyle};
`;

const DeleteIcon = styled(DeleteRoundedIcon)`
  ${fontSizeStyle};
`;

const EditIcon = styled(EditRoundedIcon)`
  ${fontSizeStyle};
`;

const EmailIcon = styled(EmailRoundedIcon)`
  ${fontSizeStyle};
`;

const ListsIcon = styled(ListAltRoundedIcon)`
  ${fontSizeStyle}
`;

const DownIcon = styled(ArrowDropDownRoundedIcon)`
  ${fontSizeStyle}
`;

const UpIcon = styled(ArrowDropUpRoundedIcon)`
  ${fontSizeStyle}
`;

const AddIcon = styled(AddRoundedIcon)`
  ${fontSizeStyle}
`;

const Refresh = styled(RefreshIcon)`
  ${fontSizeStyle}
`

export {
  CollectionIcon,
  DonorIcon,
  SampleIcon,
  DatasetIcon,
  PublicationIcon,
  CenterIcon,
  ExternalLinkIcon,
  InfoIcon,
  SuccessIcon,
  FileIcon,
  ErrorIcon,
  MoreIcon,
  DeleteIcon,
  EditIcon,
  EmailIcon,
  ListsIcon,
  DownIcon,
  UpIcon,
  AddIcon,
  Refresh,
};
