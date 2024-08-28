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
} from './icons';

export type MUIIcon = typeof DonorIcon;

type CellTypeEntityType = 'CellType';
type GeneEntityType = 'Gene';
type UBKGEntityType = CellTypeEntityType | GeneEntityType;

type VerifiedUserEntityType = 'VerifiedUser';
type GlobusEntityType = VerifiedUserEntityType;

type WorkspaceEntityType = 'Workspace' | 'Workspace Template';

type WorkspaceAPIEntityType = WorkspaceEntityType;

export type AllEntityTypes = ESEntityType | UBKGEntityType | WorkspaceAPIEntityType | GlobusEntityType;

export const entityIconMap: Record<AllEntityTypes, MUIIcon> = {
  Donor: DonorIcon,
  Sample: SampleIcon,
  Dataset: DatasetIcon,
  Support: DatasetIcon,
  Publication: PublicationIcon,
  Collection: CollectionIcon,
  Workspace: WorkspacesIcon,
  'Workspace Template': WorkspacesIcon,
  CellType: CellTypeIcon,
  Gene: GeneIcon,
  VerifiedUser: VerifiedIcon,
};
