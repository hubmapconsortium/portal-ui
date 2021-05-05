import React, { useEffect, useContext } from 'react';
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
import DerivedDatasetsTable from 'js/components/Detail/DerivedDatasetsTable';

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

  function useDerivedEntitySearchHits(ancestorUUID) {
    const { elasticsearchEndpoint, nexusToken } = useContext(AppContext);
    const sampleSpecificDatasetsQuery = {
      query: {
        bool: {
          filter: [
            {
              term: {
                ancestor_ids: ancestorUUID,
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
      _source: ['uuid', 'display_doi', 'mapped_data_types', 'status', 'descendant_counts', 'last_modified_timestamp'],
      size: 10000,
    };

    return useSearchHits(sampleSpecificDatasetsQuery, elasticsearchEndpoint, nexusToken);
  }

  const { searchHits: sampleSpecificDatasets } = useDerivedEntitySearchHits(uuid);

  const shouldDisplaySection = {
    protocols: Boolean(protocol_url),
    tissue: true,
    metadata: 'metadata' in assayMetadata,
    derived: sampleSpecificDatasets.length > 0,
  };
  const sectionOrder = getSectionOrder(
    ['summary', 'derived', 'tissue', 'provenance', 'protocols', 'metadata', 'attribution'],
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
        {shouldDisplaySection.derived && <DerivedDatasetsTable datasets={sampleSpecificDatasets} uuid={uuid} />}
        <SampleTissue
          uuid={uuid}
          mapped_specimen_type={mapped_specimen_type}
          mapped_organ={mapped_organ}
          hasRUI={hasRUI}
        />
        <ProvSection uuid={uuid} assayMetadata={assayMetadata} />
        {shouldDisplaySection.protocols && <Protocol protocol_url={protocol_url} />}
        {shouldDisplaySection.metadata && <MetadataTable metadata={metadata} display_doi={display_doi} />}
        <Attribution
          group_name={group_name}
          created_by_user_displayname={created_by_user_displayname}
          created_by_user_email={created_by_user_email}
        />
      </DetailLayout>
    </DetailContext.Provider>
  );
}

export default SampleDetail;
