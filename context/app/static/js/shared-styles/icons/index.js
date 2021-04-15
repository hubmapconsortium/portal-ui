import styled from 'styled-components';
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

const CenterIcon = styled(AccountBalanceIcon)`
  font-size: ${(props) => props.fontSize};
`;

const CollectionIcon = styled(CollectionsBookmarkRoundedIcon)`
  font-size: ${(props) => props.fontSize};
`;

const DonorIcon = styled(PersonIcon)`
  font-size: ${(props) => props.fontSize};
`;

const SampleIcon = styled(BubbleChartIcon)`
  font-size: ${(props) => props.fontSize};
`;

const DatasetIcon = styled(TableChartIcon)`
  font-size: ${(props) => props.fontSize};
`;

const ExternalLinkIcon = styled(LaunchRoundedIcon)`
  font-size: ${(props) => props.fontSize};
`;

const InfoIcon = styled(InfoRoundedIcon)`
  font-size: ${(props) => props.fontSize};
`;

const SuccessIcon = styled(CheckCircleRoundedIcon)`
  font-size: ${(props) => props.fontSize};
`;

const FileIcon = styled(InsertDriveFileRoundedIcon)`
  font-size: ${(props) => props.fontSize};
`;

const ErrorIcon = styled(ErrorRoundedIcon)`
  font-size: ${(props) => props.fontSize};
`;

const MoreIcon = styled(MoreHorizRoundedIcon)`
  font-size: ${(props) => props.fontSize};
`;

const DeleteIcon = styled(DeleteRoundedIcon)`
  font-size: ${(props) => props.fontSize};
`;

const EditIcon = styled(EditRoundedIcon)`
  font-size: ${(props) => props.fontSize};
`;

export {
  CollectionIcon,
  DonorIcon,
  SampleIcon,
  DatasetIcon,
  CenterIcon,
  ExternalLinkIcon,
  InfoIcon,
  SuccessIcon,
  FileIcon,
  ErrorIcon,
  MoreIcon,
  DeleteIcon,
  EditIcon,
};
