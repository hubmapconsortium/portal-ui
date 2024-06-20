import WorkspacesIcon from 'assets/svg/workspaces.svg';
import ScatterPlot from '@mui/icons-material/ScatterPlot';
import GeneIcon from 'assets/svg/gene.svg';
import { ESEntityType } from 'js/components/types';
import { DatasetIcon, SampleIcon, DonorIcon, PublicationIcon, CollectionIcon, VerifiedIcon } from './icons';

type MUIIcon = typeof DonorIcon;
type SVGIcon = typeof WorkspacesIcon;

type CellTypeEntityType = 'CellType';
type GeneEntityType = 'Gene';
type UBKGEntityType = CellTypeEntityType | GeneEntityType;

type VerifiedUserEntityType = 'VerifiedUser';
type GlobusEntityType = VerifiedUserEntityType;

type WorkspaceEntityType = 'Workspace';

type WorkspaceAPIEntityType = WorkspaceEntityType;

type AllEntityTypes = ESEntityType | UBKGEntityType | WorkspaceAPIEntityType | GlobusEntityType;

export const entityIconMap: Record<AllEntityTypes, MUIIcon | SVGIcon> = {
  Donor: DonorIcon,
  Sample: SampleIcon,
  Dataset: DatasetIcon,
  Support: DatasetIcon,
  Publication: PublicationIcon,
  Collection: CollectionIcon,
  Workspace: WorkspacesIcon,
  CellType: ScatterPlot,
  Gene: GeneIcon,
  VerifiedUser: VerifiedIcon,
};
