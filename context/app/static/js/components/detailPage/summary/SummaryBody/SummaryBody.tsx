import React from 'react';

import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import Citation from 'js/components/detailPage/Citation';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { StyledCreationDate, StyledModificationDate } from './style';

interface SummaryBodyProps {
  description?: string;
  collectionName?: string;
  created_timestamp: number;
  published_timestamp?: number;
  last_modified_timestamp: number;
  contributors?: { last_name: string; first_name: string }[];
  citationTitle?: string;
  doi_url?: string;
  doi?: string;
}

function CollectionName({ collectionName }: Pick<SummaryBodyProps, 'collectionName'>) {
  if (!collectionName) {
    return null;
  }

  return (
    <Typography variant="h6" component="h3" mb={0.5}>
      {collectionName}
    </Typography>
  );
}

function Description({ description }: Pick<SummaryBodyProps, 'description'>) {
  if (!description) {
    return null;
  }

  return (
    <LabelledSectionText label="Description" bottomSpacing={1}>
      {description}
    </LabelledSectionText>
  );
}

function DOICitation({
  doi,
  contributors,
  doi_url,
  citationTitle,
  created_timestamp,
}: Pick<SummaryBodyProps, 'doi_url' | 'doi' | 'contributors' | 'citationTitle' | 'created_timestamp'>) {
  if (!doi || !doi_url || !contributors || !citationTitle || !created_timestamp) {
    return null;
  }
  return (
    <Citation
      doi={doi}
      doi_url={doi_url}
      contributors={contributors}
      citationTitle={citationTitle}
      created_timestamp={created_timestamp}
    />
  );
}

function SummaryBody({
  description,
  collectionName,
  created_timestamp,
  published_timestamp,
  last_modified_timestamp,
  contributors = [],
  citationTitle,
  doi_url,
  doi,
}: SummaryBodyProps) {
  const creationLabel = published_timestamp ? 'Publication Date' : 'Creation Date';
  const creationTimestamp = published_timestamp ?? created_timestamp;
  return (
    <SummaryPaper>
      <CollectionName collectionName={collectionName} />
      <Description description={description} />
      <DOICitation
        contributors={contributors}
        citationTitle={citationTitle}
        created_timestamp={created_timestamp}
        doi_url={doi_url}
        doi={doi}
      />
      <Stack direction="row">
        <StyledCreationDate label={creationLabel} timestamp={creationTimestamp} />
        <StyledModificationDate label="Last Modified" timestamp={last_modified_timestamp} />
      </Stack>
    </SummaryPaper>
  );
}

export default SummaryBody;
