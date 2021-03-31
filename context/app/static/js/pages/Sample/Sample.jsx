import React, { useEffect, useContext, useMemo } from 'react';
import Typography from '@material-ui/core/Typography';

import ProvSection from 'js/components/Detail/provenance/ProvSection';
import Summary from 'js/components/Detail/Summary';
import Attribution from 'js/components/Detail/Attribution';
import Protocol from 'js/components/Detail/Protocol';
import SummaryItem from 'js/components/Detail/SummaryItem';
import DetailLayout from 'js/components/Detail/DetailLayout';
import MetadataTable from 'js/components/Detail/MetadataTable';
import SampleTissue from 'js/components/Detail/SampleTissue';
import useSendUUIDEvent from 'js/components/Detail/useSendUUIDEvent';
import useEntityStore from 'js/stores/useEntityStore';
import { AppContext } from 'js/components/Providers';
import DetailContext from 'js/components/Detail/context';
import { getSectionOrder } from 'js/components/Detail/utils';
import { useSearchHits } from 'js/hooks/useSearchData';
import SampleSpecificDatasetsTable from 'js/components/Detail/SampleSpecificDatasetsTable';

const entityStoreSelector = (state) => state.setAssayMetadata;

function SampleDetail(props) {
  const { assayMetadata } = props;
  const {
    uuid,
    protocol_url,
    mapped_specimen_type,
    origin_sample: { mapped_organ },
    group_name,
    created_by_user_displayname,
    created_by_user_email,
    display_doi,
    entity_type,
    create_timestamp,
    last_modified_timestamp,
    description,
    metadata,
    rui_location,
  } = assayMetadata;
  const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);

  const sampleSpecificDatasetsQuery = useMemo(
    () => ({
      query: {
        bool: {
          filter: [
            {
              term: {
                ancestor_ids: uuid,
              },
            },
            {
              term: {
                entity_type: 'dataset',
              },
            },
          ],
        },
      },
      _source: [
        'uuid',
        'display_doi',
        'mapped_data_types',
        'descendant_counts',
        'origin_sample.mapped_organ',
        'status',
        'last_modified_timestamp',
      ],
      size: 10000,
    }),
    [uuid],
  );

  const { searchHits: sampleSpecificDatasets } = useSearchHits(
    sampleSpecificDatasetsQuery,
    elasticsearchEndpoint,
    nexusToken,
  );

  const shouldDisplaySection = {
    protocols: Boolean(protocol_url),
    tissue: true,
    metadata: 'metadata' in assayMetadata,
    datasets: sampleSpecificDatasets.length > 0,
  };
  const sectionOrder = getSectionOrder(
    ['summary', 'datasets', 'tissue', 'attribution', 'provenance', 'protocols', 'metadata'],
    shouldDisplaySection,
  );

  const setAssayMetadata = useEntityStore(entityStoreSelector);
  useEffect(() => {
    setAssayMetadata({ display_doi, entity_type, mapped_organ, mapped_specimen_type });
  }, [setAssayMetadata, display_doi, entity_type, mapped_organ, mapped_specimen_type]);

  useSendUUIDEvent(entity_type, uuid);

  const hasRUI = Boolean(rui_location);

  return (
    <DetailContext.Provider value={{ display_doi, uuid }}>
      <DetailLayout sectionOrder={sectionOrder}>
        <Summary
          uuid={uuid}
          entity_type={entity_type}
          display_doi={display_doi}
          create_timestamp={create_timestamp}
          last_modified_timestamp={last_modified_timestamp}
          description={description}
          group_name={group_name}
        >
          <SummaryItem>{mapped_organ}</SummaryItem>
          <Typography variant="h6" component="p">
            {mapped_specimen_type}
          </Typography>
        </Summary>
        {shouldDisplaySection.datasets && <SampleSpecificDatasetsTable datasets={sampleSpecificDatasets} uuid={uuid} />}
        <SampleTissue
          uuid={uuid}
          mapped_specimen_type={mapped_specimen_type}
          mapped_organ={mapped_organ}
          hasRUI={hasRUI}
        />
        <Attribution
          group_name={group_name}
          created_by_user_displayname={created_by_user_displayname}
          created_by_user_email={created_by_user_email}
        />
        <ProvSection uuid={uuid} assayMetadata={assayMetadata} />
        {shouldDisplaySection.protocols && <Protocol protocol_url={protocol_url} />}
        {shouldDisplaySection.metadata && <MetadataTable metadata={metadata} display_doi={display_doi} />}
      </DetailLayout>
    </DetailContext.Provider>
  );
}

export default SampleDetail;
