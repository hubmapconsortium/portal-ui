import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';

import type { Entity } from 'js/components/types';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import RelatedEntitiesSectionActions from 'js/components/detailPage/related-entities/RelatedEntitiesSectionActions';
import { buildSearchLink } from 'js/components/search/store';
import { SectionDescription } from 'js/shared-styles/sections/SectionDescription';
import RelatedEntitiesTabs from 'js/components/detailPage/related-entities/RelatedEntitiesTabs';

import { useCollectionsDatasets } from './hooks';

interface CollectionDatasetsTableProps {
  datasets: Entity[];
}

function CollectionDatasetsTable({ datasets }: CollectionDatasetsTableProps) {
  const {
    datasets: data,
    columns,
    uuids,
  } = useCollectionsDatasets({
    ids: datasets.map((d) => d.uuid),
  });
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <CollapsibleDetailPageSection
      title="Datasets"
      id="datasets-table"
      icon={sectionIconMap.datasets}
      buttons={
        <RelatedEntitiesSectionActions
          searchPageHref={buildSearchLink({
            entity_type: 'Dataset',
            filters: {
              uuid: {
                type: 'TERM',
                values: Array.from(uuids),
              },
            },
          })}
          uuids={uuids}
        />
      }
    >
      <SectionDescription>This is the list of data that is in this collection.</SectionDescription>
      <Paper>
        <RelatedEntitiesTabs
          entities={[
            {
              entityType: 'Dataset' as const,
              tabLabel: 'Datasets',
              data,
              columns,
            },
          ]}
          openIndex={openIndex}
          setOpenIndex={setOpenIndex}
          ariaLabel="Derived Data Tabs"
          renderWarningMessage={(tableEntityType) => `No ${tableEntityType.toLowerCase()}s for this collection.`}
        />
      </Paper>
    </CollapsibleDetailPageSection>
  );
}

CollectionDatasetsTable.propTypes = {
  datasets: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CollectionDatasetsTable;
