import React, { useMemo } from 'react';
import Typography from '@mui/material/Typography';
import TableOfContents from 'js/shared-styles/sections/TableOfContents';
import { getSections } from 'js/shared-styles/sections/TableOfContents/utils';
import useSearchData from 'js/hooks/useSearchData';
import Azimuth from 'js/components/organ/Azimuth';
import Assays from 'js/components/organ/Assays';
import Description from 'js/components/organ/Description';
import HumanReferenceAtlas from 'js/components/organ/HumanReferenceAtlas';
import Samples from 'js/components/organ/Samples';
import DatasetsBarChart from 'js/components/organ/OrganDatasetsChart';
import Section from 'js/shared-styles/sections/Section';

import { OrganFile } from 'js/components/organ/types';
import { FlexRow, Content } from './style';

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

const summaryId = 'Summary';
const hraId = 'Human Reference Atlas';
const referenceId = 'Reference-Based Analysis';
const assaysId = 'Assays';
const samplesId = 'Samples';

function Organ({ organ }: OrganProps) {
  const searchItems = useMemo(
    // to avoid returning all datasets with organ.search, [organ.name] is added
    () => (organ.search.length > 0 ? organ.search : [organ.name]),
    [organ.search, organ.name],
  );

  let shouldDisplaySearch = organ.search.length >= 0;

  const query = useMemo(
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
                {
                  bool: {
                    should: searchItems.map((searchTerm) => ({
                      term: { 'origin_samples.mapped_organ.keyword': searchTerm },
                    })),
                  },
                },
              ],
            },
          },
          aggs: {
            'assay_display_name.keyword': { terms: { field: 'assay_display_name.keyword', size: 100 } },
            'assay_display_name.keyword_count': { cardinality: { field: 'assay_display_name.keyword' } },
          },
        },
      },
    }),
    [searchItems],
  );

  const { searchData } = useSearchData<Document, Aggregations>(query);

  const buckets = searchData.aggregations
    ? searchData.aggregations.mapped_data_types['assay_display_name.keyword'].buckets
    : [];

  // update the sections map when there are no datasets
  if (buckets.length === 0) {
    shouldDisplaySearch = organ.search.length > 0;
  }

  const shouldDisplaySection = {
    [summaryId]: Boolean(organ?.description),
    [hraId]: organ.has_iu_component,
    [referenceId]: Boolean(organ?.azimuth),
    [assaysId]: shouldDisplaySearch,
    [samplesId]: shouldDisplaySearch,
  };

  const sectionOrder = Object.entries(shouldDisplaySection)
    .filter(([, shouldDisplay]) => shouldDisplay)
    .map(([sectionName]) => sectionName);
  const sections = new Map(getSections(sectionOrder));

  return (
    <FlexRow>
      <TableOfContents items={[...sections.values()]} />
      <Content>
        <Typography variant="subtitle1" component="h1" color="primary">
          Organ
        </Typography>
        <Typography variant="h1" component="h2">
          {organ.name}
        </Typography>
        {shouldDisplaySection[summaryId] && (
          <Section id={summaryId}>
            <Description uberonIri={organ.uberon} uberonShort={organ.uberon_short} asctbId={organ.asctb}>
              {organ.description}
            </Description>
          </Section>
        )}
        {shouldDisplaySection[hraId] && (
          <Section id={hraId}>
            <HumanReferenceAtlas uberonIri={organ.uberon} />
          </Section>
        )}
        {shouldDisplaySection[referenceId] && (
          <Section id={referenceId}>
            <Azimuth config={organ.azimuth} />
          </Section>
        )}
        {shouldDisplaySection[assaysId] && (
          <Section id={assaysId}>
            <Assays organTerms={searchItems} bucketData={buckets} />
            <DatasetsBarChart search={searchItems} />
          </Section>
        )}
        {shouldDisplaySection[samplesId] && (
          <Section id={samplesId}>
            <Samples organTerms={searchItems} />
          </Section>
        )}
      </Content>
    </FlexRow>
  );
}

export default Organ;
