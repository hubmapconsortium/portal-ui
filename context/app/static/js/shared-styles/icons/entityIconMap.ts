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
  FileIcon,
} from './icons';

export type MUIIcon = typeof DonorIcon;

type CellTypeEntityType = 'CellType';
type GeneEntityType = 'Gene';
type UBKGEntityType = CellTypeEntityType | GeneEntityType;

// Files are indexed and searchable, but are not HuBMAP entities.
type FileEntityType = 'File';

type VerifiedUserEntityType = 'VerifiedUser';
type GlobusEntityType = VerifiedUserEntityType;

type WorkspaceEntityType = 'Workspace' | 'WorkspaceTemplate';

type WorkspaceAPIEntityType = WorkspaceEntityType;

export type AllEntityTypes =
  | ESEntityType
  | UBKGEntityType
  | WorkspaceAPIEntityType
  | GlobusEntityType
  | FileEntityType
  | 'Tutorial';

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
  File: FileIcon,
};

export const hasIconForEntity = (entityType?: string): entityType is AllEntityTypes => {
  return Boolean(entityType && entityType in entityIconMap);
};
