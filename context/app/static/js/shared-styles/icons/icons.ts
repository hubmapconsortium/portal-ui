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
import ArrowDropDownRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ContactSupportIcon from '@mui/icons-material/ContactSupportRounded';
import { styled } from '@mui/material/styles';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { ElementType } from 'react';

// The "any" here mirrors the "any" in the original SvgIconProps definition.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CustomIconProps<T extends ElementType<any>> = {
  fontSize?: string;
} & SvgIconProps<T>;

const withIconStyles = (Icon: typeof SvgIcon) =>
  styled(Icon)(({ fontSize }: CustomIconProps<ElementType<'svg'>>) => ({
    fontSize: fontSize ?? '1rem',
  })) as typeof SvgIcon;

const CenterIcon = withIconStyles(AccountBalanceIcon);

const CloseIcon = withIconStyles(CloseRoundedIcon);

const CollectionIcon = withIconStyles(CollectionsBookmarkRoundedIcon);

const DonorIcon = withIconStyles(PersonIcon);

const SampleIcon = withIconStyles(BubbleChartIcon);

const DatasetIcon = withIconStyles(TableChartIcon);

const PublicationIcon = withIconStyles(DescriptionOutlinedIcon);

const ExternalLinkIcon = withIconStyles(LaunchRoundedIcon);

const InfoIcon = withIconStyles(InfoRoundedIcon);

const SuccessIcon = withIconStyles(CheckCircleRoundedIcon);

const FileIcon = withIconStyles(InsertDriveFileRoundedIcon);

const ErrorIcon = withIconStyles(ErrorRoundedIcon);

const MoreIcon = withIconStyles(MoreHorizRoundedIcon);

const DeleteIcon = withIconStyles(DeleteRoundedIcon);

const EditIcon = withIconStyles(EditRoundedIcon);

const EmailIcon = withIconStyles(EmailRoundedIcon);

const ListsIcon = withIconStyles(ListAltRoundedIcon);

const DownIcon = withIconStyles(ArrowDropDownRoundedIcon);

const UpIcon = withIconStyles(ArrowDropUpRoundedIcon);

const AddIcon = withIconStyles(AddRoundedIcon);

const SupportIcon = withIconStyles(ContactSupportIcon);

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
