import { ESEntityType } from 'js/components/types';
import {
  DatasetIcon,
  SampleIcon,
  DonorIcon,
  PublicationIcon,
  CollectionIcon,
  VerifiedIcon,
  GeneIcon,
  WorkspacesIcon,
  CellTypeIcon,
  TutorialIcon,
} from './icons';

export type MUIIcon = typeof DonorIcon;

type CellTypeEntityType = 'CellType';
type GeneEntityType = 'Gene';
type UBKGEntityType = CellTypeEntityType | GeneEntityType;

type VerifiedUserEntityType = 'VerifiedUser';
type GlobusEntityType = VerifiedUserEntityType;

type WorkspaceEntityType = 'Workspace' | 'WorkspaceTemplate';

type WorkspaceAPIEntityType = WorkspaceEntityType;

export type AllEntityTypes = ESEntityType | UBKGEntityType | WorkspaceAPIEntityType | GlobusEntityType | 'Tutorial';

export const entityIconMap: Record<AllEntityTypes, MUIIcon> = {
  Donor: DonorIcon,
  Sample: SampleIcon,
  Dataset: DatasetIcon,
  Support: DatasetIcon,
  Publication: PublicationIcon,
  Collection: CollectionIcon,
  Workspace: WorkspacesIcon,
  WorkspaceTemplate: WorkspacesIcon,
  CellType: CellTypeIcon,
  Gene: GeneIcon,
  VerifiedUser: VerifiedIcon,
  Tutorial: TutorialIcon,
};

export const hasIconForEntity = (entityType?: string): entityType is AllEntityTypes => {
  return Boolean(entityType && entityType in entityIconMap);
};
