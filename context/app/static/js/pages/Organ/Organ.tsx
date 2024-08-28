import React, { useMemo } from 'react';
import Typography from '@mui/material/Typography';

import useSearchData, { useSearchHits } from 'js/hooks/useSearchData';
import Azimuth from 'js/components/organ/Azimuth';
import Assays from 'js/components/organ/Assays';
import Description from 'js/components/organ/Description';
import HumanReferenceAtlas from 'js/components/organ/HumanReferenceAtlas';
import Samples from 'js/components/organ/Samples';
import { OrganFile } from 'js/components/organ/types';
import DetailLayout from 'js/components/detailPage/DetailLayout';
import { mustHaveOrganClause } from './queries';

interface OrganProps {
  organ: OrganFile;
}

interface Bucket {
  key: string;
  doc_count: number;
}

interface Aggregations {
  mapped_data_types: {
    'assay_display_name.keyword': {
      buckets: Bucket[];
    };
  };
}

const summaryId = 'summary';
const hraId = 'human-reference-atlas';
const referenceId = 'reference-based-analysis';
const assaysId = 'assays';
const samplesId = 'samples';

function Organ({ organ }: OrganProps) {
  const searchItems = useMemo(
    () => (organ.search.length > 0 ? organ.search : [organ.name]),
    [organ.search, organ.name],
  );

  const assaysQuery = useMemo(
    () => ({
      size: 0,
      aggs: {
        mapped_data_types: {
          filter: {
            bool: {
              must: [
                {
                  term: {
                    'entity_type.keyword': 'Dataset',
                  },
                },
                mustHaveOrganClause(searchItems),
              ],
            },
          },
          aggs: {
            'assay_display_name.keyword': { terms: { field: 'assay_display_name.keyword', size: 100 } },
          },
        },
      },
    }),
    [searchItems],
  );

  const samplesQuery = useMemo(
    () => ({
      query: {
        bool: {
          must: [
            {
              term: {
                'entity_type.keyword': 'Sample',
              },
            },
            mustHaveOrganClause(searchItems),
          ],
        },
      },
      _source: false,
      size: 1,
    }),
    [searchItems],
  );

  const { searchData: assaysData } = useSearchData<Document, Aggregations>(assaysQuery);
  const { searchHits: samplesHits } = useSearchHits(samplesQuery);

  const assayBuckets = assaysData?.aggregations?.mapped_data_types?.['assay_display_name.keyword']?.buckets ?? [];

  const shouldDisplaySection: Record<string, boolean> = {
    [summaryId]: Boolean(organ?.description),
    [hraId]: Boolean(organ.has_iu_component),
    [referenceId]: Boolean(organ?.azimuth),
    [assaysId]: assayBuckets.length > 0,
    [samplesId]: samplesHits.length > 0,
  };

  return (
    <DetailLayout sections={shouldDisplaySection}>
      <Typography variant="subtitle1" component="h1" color="primary">
        Organ
      </Typography>
      <Typography variant="h1" component="h2">
        {organ.name}
      </Typography>
      {shouldDisplaySection[summaryId] && (
        <Description id={summaryId} uberonIri={organ.uberon} uberonShort={organ.uberon_short} asctbId={organ.asctb}>
          {organ.description}
        </Description>
      )}
      {shouldDisplaySection[hraId] && <HumanReferenceAtlas id={hraId} uberonIri={organ.uberon} />}
      {shouldDisplaySection[referenceId] && <Azimuth id={referenceId} config={organ.azimuth!} />}
      {shouldDisplaySection[assaysId] && <Assays id={assaysId} organTerms={searchItems} bucketData={assayBuckets} />}
      {shouldDisplaySection[samplesId] && <Samples id={samplesId} organTerms={searchItems} />}
    </DetailLayout>
  );
}

export default Organ;
