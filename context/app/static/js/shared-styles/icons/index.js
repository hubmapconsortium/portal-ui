import styled, { css } from 'styled-components';
// NOTE: We are using the rounded icon variants consistently.
import BubbleChartIcon from '@mui/icons-material/BubbleChartRounded';
import PersonIcon from '@mui/icons-material/PersonRounded';
import TableChartIcon from '@mui/icons-material/TableChartRounded';
import AccountBalanceIcon from '@mui/icons-material/AccountBalanceRounded';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CollectionsBookmarkRoundedIcon from '@mui/icons-material/CollectionsBookmarkRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

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
};
