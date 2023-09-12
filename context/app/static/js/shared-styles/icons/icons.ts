// NOTE: We are using the Rounded icon variants consistently.
import BubbleChartIcon from '@mui/icons-material/BubbleChartRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
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
import ContactSupportIcon from '@mui/icons-material/ContactSupportOutlined';
import { styled } from '@mui/material/styles';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { ElementType } from 'react';

// The "any" here mirrors the "any" in the original SvgIconProps definition.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CustomIconProps<T extends ElementType<any>> = {
  fontSize?: string;
} & SvgIconProps<T>;

const iconStyles = ({ fontSize }: CustomIconProps<ElementType<'svg'>>) => ({
  fontSize: fontSize ?? '1rem',
});

const CenterIcon = styled(AccountBalanceIcon)(iconStyles) as typeof AccountBalanceIcon;

const CloseIcon = styled(CloseRoundedIcon)(iconStyles) as typeof CloseRoundedIcon;

const CollectionIcon = styled(CollectionsBookmarkRoundedIcon)(iconStyles) as typeof CollectionsBookmarkRoundedIcon;

const DonorIcon = styled(PersonIcon)(iconStyles) as typeof PersonIcon;

const SampleIcon = styled(BubbleChartIcon)(iconStyles) as typeof BubbleChartIcon;

const DatasetIcon = styled(TableChartIcon)(iconStyles) as typeof TableChartIcon;

const PublicationIcon = styled(DescriptionOutlinedIcon)(iconStyles) as typeof DescriptionOutlinedIcon;

const ExternalLinkIcon = styled(LaunchRoundedIcon)(iconStyles) as typeof LaunchRoundedIcon;

const InfoIcon = styled(InfoRoundedIcon)(iconStyles) as typeof InfoRoundedIcon;

const SuccessIcon = styled(CheckCircleRoundedIcon)(iconStyles) as typeof CheckCircleRoundedIcon;

const FileIcon = styled(InsertDriveFileRoundedIcon)(iconStyles) as typeof InsertDriveFileRoundedIcon;

const ErrorIcon = styled(ErrorRoundedIcon)(iconStyles) as typeof ErrorRoundedIcon;

const MoreIcon = styled(MoreHorizRoundedIcon)(iconStyles) as typeof MoreHorizRoundedIcon;

const DeleteIcon = styled(DeleteRoundedIcon)(iconStyles) as typeof DeleteRoundedIcon;

const EditIcon = styled(EditRoundedIcon)(iconStyles) as typeof EditRoundedIcon;

const EmailIcon = styled(EmailRoundedIcon)(iconStyles) as typeof EmailRoundedIcon;

const ListsIcon = styled(ListAltRoundedIcon)(iconStyles) as typeof ListAltRoundedIcon;

const DownIcon = styled(ArrowDropDownRoundedIcon)(iconStyles) as typeof ArrowDropDownRoundedIcon;

const UpIcon = styled(ArrowDropUpRoundedIcon)(iconStyles) as typeof ArrowDropUpRoundedIcon;

const AddIcon = styled(AddRoundedIcon)(iconStyles) as typeof AddRoundedIcon;

const SupportIcon = styled(ContactSupportIcon)(iconStyles) as typeof ContactSupportIcon;

export {
  CloseIcon,
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
  SupportIcon,
};
