import React from 'react';
import Stack, { StackProps } from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import Citation from 'js/components/detailPage/Citation';
import { Entity, isCollection } from 'js/components/types';
import { useFlaskDataContext } from 'js/components/Contexts';
import { useEntityStore } from 'js/stores';
import { StyledCreationDate } from './style';

function CollectionName() {
  const { entity } = useFlaskDataContext();

  if (!isCollection(entity)) {
    return null;
  }
  const { title } = entity;

  if (!title) {
    return null;
  }

  return (
    <Typography variant="h6" component="h3" mb={0.5}>
      {title}
    </Typography>
  );
}

function Description({ description }: Pick<Entity, 'description'>) {
  if (!description) {
    return null;
  }

  return (
    <LabelledSectionText label="Description" bottomSpacing={1}>
      {description}
    </LabelledSectionText>
  );
}

function DOICitation() {
  const { entity } = useFlaskDataContext();
  const {
    assayMetadata: { doi },
  } = useEntityStore();

  if (!isCollection(entity)) {
    return null;
  }

  const { doi_url, contributors, created_timestamp, title } = entity;

  if (!doi || !doi_url || !contributors || !title || !created_timestamp) {
    return null;
  }
  return (
    <Citation
      doi={doi}
      doi_url={doi_url}
      contributors={contributors}
      citationTitle={title}
      created_timestamp={created_timestamp}
    />
  );
}

function SummaryBodyContent({
  direction = 'column',
  published_timestamp,
  created_timestamp,
  description,
}: Pick<StackProps, 'direction'> & Pick<Entity, 'description' | 'created_timestamp' | 'published_timestamp'>) {
  const creationLabel = published_timestamp ? 'Publication Date' : 'Creation Date';
  const creationTimestamp = published_timestamp ?? created_timestamp;

  return (
    <Stack component={SummaryPaper} direction={direction}>
      <CollectionName />
      <Description description={description} />
      <DOICitation />
      <StyledCreationDate label={creationLabel} timestamp={creationTimestamp} />
    </Stack>
  );
}

function SummaryBody({ direction = 'column' }: Pick<StackProps, 'direction'>) {
  const { entity } = useFlaskDataContext();

  const { created_timestamp, published_timestamp, description } = entity;

  return (
    <SummaryBodyContent
      direction={direction}
      created_timestamp={created_timestamp}
      published_timestamp={published_timestamp}
      description={description}
    />
  );
}

export { SummaryBodyContent };
export default SummaryBody;
