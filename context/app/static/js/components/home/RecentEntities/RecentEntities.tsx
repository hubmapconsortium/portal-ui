import React from 'react';
import Grid from '@mui/material/Grid';
import Panel from 'js/shared-styles/panels/Panel';
import { useOrgan } from 'js/hooks/useOrgansApi';
import URLSvgIcon from 'js/shared-styles/icons/URLSvgIcon';

import { buildSearchLink } from 'js/components/search/store';
import { getEntityCreationInfo } from 'js/helpers/functions';
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

function DatasetPanel({ entity }: EntityPanelProps<RecentDataset>) {
  const { title, uuid, hubmap_id, group_name, origin_samples_unique_mapped_organs: organs } = entity;
  const { creationDate } = getEntityCreationInfo({ entity_type: 'Dataset', ...entity });

  const organ = organs.length ? organs[0] : '';
  const data = useOrgan(organ);
  const iconUrl = data?.data?.icon ?? '';
  return (
    <Panel
      title={title}
      href={`/browse/dataset/${uuid}`}
      secondaryText={`${hubmap_id} | ${group_name} | ${creationDate}`}
      small
      icon={<URLSvgIcon iconURL={iconUrl} ariaLabel={`Dataset containing ${organ}`} display="inline-block" />}
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
      entityName="Dataset"
      entities={recentDatasets}
      entityComponent={DatasetPanel}
      viewAllLink={buildSearchLink({
        entity_type: 'Dataset',
      })}
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
      entityName="Publication"
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
