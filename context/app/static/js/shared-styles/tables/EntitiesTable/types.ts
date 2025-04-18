import { ComponentType, ElementType } from 'react';
import { SearchRequest, SearchHit } from '@elastic/elasticsearch/lib/api/types';
import { Entity } from 'js/components/types';

export interface Column<Doc> {
  label: string;
  id: string;
  sort?: string;
  cellContent: ComponentType<{ hit: SearchHit<Doc> }> | ElementType;
}

export interface EntitiesTabTypes<Doc extends Entity> {
  query: SearchRequest;
  columns: Column<Doc>[];
  entityType: 'Donor' | 'Sample' | 'Dataset';
  expandedContent?: React.ComponentType<Doc>;
}
