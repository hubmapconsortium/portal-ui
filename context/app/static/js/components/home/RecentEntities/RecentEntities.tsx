import React from 'react';
import Panel from 'js/shared-styles/panels/Panel';
import { useOrgan } from 'js/hooks/useOrgansApi';
import URLSvgIcon from 'js/shared-styles/icons/URLSvgIcon';
import Grid from '@mui/material/Grid';
import { format } from 'date-fns/format';
import { buildPublicationPanelProps } from 'js/components/publications/PublicationsPanelList/utils';
import {
  useRecentDatasetsQuery,
  useRecentPublicationsQuery,
  type RecentDataset,
  type RecentPublication,
} from './hooks';
import { EntityList } from './EntityList';

interface EntityPanelProps<T> {
  entity: T;
}

function DatasetPanel({
  entity: { title, uuid, hubmap_id, group_name, last_modified_timestamp, origin_samples_unique_mapped_organs: organs },
}: EntityPanelProps<RecentDataset>) {
  const organ = organs.length ? organs[0] : '';
  const { data } = useOrgan(organ);
  const iconUrl = data?.icon;
  return (
    <Panel
      title={title}
      href={`/browse/datasets/${uuid}`}
      secondaryText={`${hubmap_id} | ${group_name} | ${format(last_modified_timestamp, 'yyyy-MM-dd')}`}
      small
      icon={<URLSvgIcon iconURL={iconUrl!} ariaLabel="Dataset containing {organ}" flexShrink={0} />}
    />
  );
}

function RecentDatasets() {
  const { recentDatasets = [], isLoading } = useRecentDatasetsQuery();
  if (isLoading) {
    return <div />;
  }
  return (
    <EntityList
      entityName="Datasets"
      entities={recentDatasets}
      entityComponent={DatasetPanel}
      viewAllLink="/search?entity_type[0]=Dataset"
    />
  );
}

function PublicationPanel({ entity: _source }: EntityPanelProps<RecentPublication>) {
  const props = buildPublicationPanelProps({ _source }, true);

  return <Panel small {...props} />;
}

function RecentPublications() {
  const { recentPublications = [], isLoading } = useRecentPublicationsQuery();
  if (isLoading) {
    return <div />;
  }
  return (
    <EntityList
      entityName="Publications"
      entities={recentPublications}
      entityComponent={PublicationPanel}
      viewAllLink="/publications"
    />
  );
}

export function RecentEntities() {
  return (
    <Grid gridArea="recent-entities" container spacing={4}>
      <RecentDatasets />
      <RecentPublications />
    </Grid>
  );
}
