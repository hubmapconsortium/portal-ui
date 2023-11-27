import { ReactComponent as WorkspacesIcon } from 'assets/svg/workspaces.svg';
import ScatterPlot from '@mui/icons-material/ScatterPlot';
import { DatasetIcon, SampleIcon, DonorIcon, PublicationIcon, CollectionIcon } from './icons';

export const entityIconMap = {
  Donor: DonorIcon,
  Sample: SampleIcon,
  Dataset: DatasetIcon,
  Support: DatasetIcon,
  Publication: PublicationIcon,
  Collection: CollectionIcon,
  Workspace: WorkspacesIcon,
  CellType: ScatterPlot,
};
