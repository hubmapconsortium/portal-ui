import React, { ElementType } from 'react';

// NOTE: We are using the Rounded icon variants consistently.
import BubbleChartIcon from '@mui/icons-material/BubbleChartRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PersonIcon from '@mui/icons-material/PersonRounded';
import TableChartIcon from '@mui/icons-material/TableChartRounded';
import AccountBalanceIcon from '@mui/icons-material/AccountBalanceRounded';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CollectionsBookmarkRoundedIcon from '@mui/icons-material/CollectionsBookmarkRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import ContactSupportIcon from '@mui/icons-material/ContactSupportRounded';
import VerifiedUserRounded from '@mui/icons-material/VerifiedUserRounded';
import { styled } from '@mui/material/styles';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import LightbulbOutlined from '@mui/icons-material/LightbulbOutlined';
import GetAppRounded from '@mui/icons-material/GetAppRounded';
import ScatterPlot from '@mui/icons-material/ScatterPlot';
import SummarizeRoundedIcon from '@mui/icons-material/SummarizeRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import BarChartRounded from '@mui/icons-material/BarChartRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import CloudDownloadRoundedIcon from '@mui/icons-material/CloudDownloadRounded';
import SchemaRoundedIcon from '@mui/icons-material/SchemaRounded';
import AttributionRoundedIcon from '@mui/icons-material/AttributionRounded';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import BookmarkAddRounded from '@mui/icons-material/BookmarkAddRounded';
import BookmarkAddedRounded from '@mui/icons-material/BookmarkAddedRounded';
import BiotechRounded from '@mui/icons-material/BiotechRounded';
import InboxRounded from '@mui/icons-material/InboxRounded';
import SendIcon from '@mui/icons-material/Send';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CancelPresentationRoundedIcon from '@mui/icons-material/CancelPresentationRounded';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarsRounded from '@mui/icons-material/StarsRounded';
import DataThresholdingRounded from '@mui/icons-material/DataThresholdingRounded';

import { createSvgIcon } from '@mui/material/utils';
import DatabaseIconSVG from 'assets/svg/database.svg';
import SearchIconSVG from 'assets/svg/search-icon.svg';
import WorkspacesIconSVG from 'assets/svg/workspaces.svg';
import GeneIconSVG from 'assets/svg/gene.svg';
import OrganSVG from 'assets/svg/organ.svg';
import EuiSVG from 'assets/svg/eui.svg';
import AsctBSVG from 'assets/svg/asct+b.svg';
import MenuBookRounded from '@mui/icons-material/MenuBookRounded';

type CustomIconProps<T extends ElementType> = {
  fontSize?: string;
} & SvgIconProps<T>;

const muiSizes = ['small', 'medium', 'large', 'inherit'];

const withIconStyles = (Icon: typeof SvgIcon) =>
  styled(Icon)(({ fontSize }: CustomIconProps<ElementType<'svg'>>) => {
    if (fontSize && muiSizes.includes(fontSize)) {
      return {}; // Let MUI handle standard size values
    }
    return { fontSize: fontSize ?? '1rem' };
  }) as unknown as typeof SvgIcon;

const CenterIcon = withIconStyles(AccountBalanceIcon);

const CloseIcon = withIconStyles(CloseRoundedIcon);

const CollectionIcon = withIconStyles(CollectionsBookmarkRoundedIcon);

const DonorIcon = withIconStyles(PersonIcon);

const SampleIcon = withIconStyles(BubbleChartIcon);

const DatasetIcon = withIconStyles(TableChartIcon);

const PublicationIcon = withIconStyles(ArticleRoundedIcon);

const ExternalLinkIcon = withIconStyles(LaunchRoundedIcon);

const InfoIcon = withIconStyles(InfoRoundedIcon);

const SuccessIcon = withIconStyles(CheckCircleRoundedIcon);

const SuccessRoundIcon = withIconStyles(CheckCircleIcon);

const PendingRoundIcon = withIconStyles(PendingIcon);

const FileIcon = withIconStyles(InsertDriveFileRoundedIcon);

const ErrorIcon = withIconStyles(ErrorRoundedIcon);

const MoreIcon = withIconStyles(MoreHorizRoundedIcon);

const DeleteIcon = withIconStyles(DeleteRoundedIcon);

const EditIcon = withIconStyles(EditRoundedIcon);

const EmailIcon = withIconStyles(EmailRoundedIcon);

const ListsIcon = withIconStyles(ListAltRoundedIcon);

const DownIcon = withIconStyles(ExpandMore);

const UpIcon = withIconStyles(ExpandLess);

const AddIcon = withIconStyles(AddRoundedIcon);

const SupportIcon = withIconStyles(ContactSupportIcon);

const VerifiedIcon = withIconStyles(VerifiedUserRounded);

const VisualizationIcon = withIconStyles(BarChartRounded);

const DownloadIcon = withIconStyles(GetAppRounded);

const LightbulbIcon = withIconStyles(LightbulbOutlined);

const CellTypeIcon = withIconStyles(ScatterPlot);

const SummaryIcon = withIconStyles(SummarizeRoundedIcon);

const ProcessedDataIcon = withIconStyles(AccountTreeRoundedIcon);

const AnalysisDetailsIcon = withIconStyles(FactCheckRoundedIcon);

const MetadataIcon = withIconStyles(DescriptionRoundedIcon);

const BulkDataIcon = withIconStyles(CloudDownloadRoundedIcon);

const ProvenanceIcon = withIconStyles(SchemaRoundedIcon);

const AttributionIcon = withIconStyles(AttributionRoundedIcon);

const SaveEntityIcon = withIconStyles(BookmarkAddRounded);

const EditSavedEntityIcon = withIconStyles(BookmarkAddedRounded);

const CheckIcon = withIconStyles(CheckRoundedIcon);

const SampleCategoryIcon = withIconStyles(BiotechRounded);

const ReceivedIcon = withIconStyles(InboxRounded);

const SentIcon = withIconStyles(SendIcon);

const EyeIcon = withIconStyles(VisibilityIcon);

const DotMenuIcon = withIconStyles(MoreVertIcon);

const CloseFilledIcon = withIconStyles(CancelIcon);

const StartJobIcon = withIconStyles(PlayArrowIcon);

const StopJobIcon = withIconStyles(StopIcon);

const NotificationIcon = withIconStyles(NotificationsIcon);

const StopAllIcon = withIconStyles(CancelPresentationRoundedIcon);

const ChecklistIcon = withIconStyles(ChecklistRoundedIcon);

const FeaturedIcon = withIconStyles(StarsRounded);

const TutorialIcon = withIconStyles(MenuBookRounded);

const DataProductsIcon = withIconStyles(DataThresholdingRounded);

const SearchIcon = withIconStyles(createSvgIcon(<SearchIconSVG />, 'Search'));

const DatabaseIcon = withIconStyles(createSvgIcon(<DatabaseIconSVG />, 'Database'));

const GeneIcon = withIconStyles(createSvgIcon(<GeneIconSVG />, 'Gene'));

const WorkspacesIcon = withIconStyles(createSvgIcon(<WorkspacesIconSVG />, 'Workspaces'));

const OrganIcon = withIconStyles(createSvgIcon(<OrganSVG />, 'Organ'));

const EUIIcon = withIconStyles(createSvgIcon(<EuiSVG />, 'EUI'));

const AsctBIcon = withIconStyles(createSvgIcon(<AsctBSVG />, 'ASCT+B'));

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
  VerifiedIcon,
  VisualizationIcon,
  DownloadIcon,
  LightbulbIcon,
  SearchIcon,
  DatabaseIcon,
  GeneIcon,
  WorkspacesIcon,
  OrganIcon,
  EUIIcon,
  AsctBIcon,
  CellTypeIcon,
  SummaryIcon,
  ProcessedDataIcon,
  MetadataIcon,
  DataProductsIcon,
  BulkDataIcon,
  ProvenanceIcon,
  AttributionIcon,
  AnalysisDetailsIcon,
  SaveEntityIcon,
  EditSavedEntityIcon,
  CheckIcon,
  SampleCategoryIcon,
  ReceivedIcon,
  SentIcon,
  EyeIcon,
  DotMenuIcon,
  CloseFilledIcon,
  SuccessRoundIcon,
  PendingRoundIcon,
  StartJobIcon,
  StopJobIcon,
  NotificationIcon,
  StopAllIcon,
  ChecklistIcon,
  FeaturedIcon,
  TutorialIcon,
};
