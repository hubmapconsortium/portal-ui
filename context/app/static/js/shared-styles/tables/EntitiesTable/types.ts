import React, { ComponentType, ElementType } from 'react';
import { SearchRequest, SearchHit } from '@elastic/elasticsearch/lib/api/types';
import { Entity } from 'js/components/types';

export interface Column<Doc> {
  label: string;
  id: string;
  sort?: string;
  cellContent: ComponentType<{ hit: SearchHit<Doc> }> | ElementType;
  tooltipText?: string;
  width?: number;
  filterable?: boolean;
  /** Map of entity ID to custom sort value for client-side sorting */
  customSortValues?: Record<string, number | string>;
}

export interface EntitiesTabTypes<Doc extends Entity> {
  query: SearchRequest;
  columns: Column<Doc>[];
  entityType: 'Donor' | 'Sample' | 'Dataset';
  expandedContent?: React.ComponentType<Doc>;
  estimatedExpandedRowHeight?: number;
  reverseExpandIndicator?: boolean;
  headerActions?: React.ReactNode;
  initialSortState?: { columnId: string; direction: 'desc' | 'asc' };
  tabTooltipText?: string;
}
