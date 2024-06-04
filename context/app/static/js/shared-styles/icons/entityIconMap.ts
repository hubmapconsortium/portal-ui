import { ReactComponent as WorkspacesIcon } from 'assets/svg/workspaces.svg';
import ScatterPlot from '@mui/icons-material/ScatterPlot';
import { ReactComponent as GeneIcon } from 'assets/svg/gene.svg';
import { AllEntityTypes } from 'js/components/types';
import { DatasetIcon, SampleIcon, DonorIcon, PublicationIcon, CollectionIcon, VerifiedIcon } from './icons';

type MUIIcon = typeof DonorIcon;
type SVGIcon = typeof WorkspacesIcon;

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
