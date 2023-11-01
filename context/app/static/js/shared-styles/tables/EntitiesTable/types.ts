import { ComponentType, ElementType } from 'react';
import { SearchRequest, SearchHit } from '@elastic/elasticsearch/lib/api/types';

export interface Column<Doc> {
  label: string;
  id: string;
  sort?: string;
  cellContent: ComponentType<{ hit: SearchHit<Doc> }> | ElementType;
}

export interface EntitiesTabTypes<Doc> {
  query: SearchRequest;
  columns: Column<Doc>[];
  tabLabel: string;
}
