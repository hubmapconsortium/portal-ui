import React from 'react';
import Stack, { StackProps } from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import Citation from 'js/components/detailPage/Citation';
import { Entity, isCollection, isDataset, isPublication } from 'js/components/types';
import { useFlaskDataContext } from 'js/components/Contexts';
import { getCollectionDOI } from 'js/pages/Collection/utils';
import { StyledCreationDate } from './style';
import PublicationSummaryBody from './PublicationSummaryBody';
import SummaryDescription from './SummaryDescription';

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
    <Typography variant="h6" component="h3">
      {title}
    </Typography>
  );
}

function DatasetCitation() {
  const { entity } = useFlaskDataContext();

  if (!isDataset(entity)) {
    return null;
  }

  const { doi_url, registered_doi } = entity;

  if (!(doi_url && registered_doi)) {
    return null;
  }

  return (
    <LabelledSectionText label="Citation">
      <OutboundIconLink href={doi_url} variant="h6">
        doi:{registered_doi}
      </OutboundIconLink>
    </LabelledSectionText>
  );
}

function DatasetConsortium() {
  const { entity } = useFlaskDataContext();

  if (!isDataset(entity)) {
    return null;
  }

  const { mapped_consortium } = entity;

  if (!mapped_consortium) {
    return null;
  }

  return <LabelledSectionText label="Consortium">{mapped_consortium}</LabelledSectionText>;
}

function CollectionCitation() {
  const { entity } = useFlaskDataContext();

  if (!isCollection(entity)) {
    return null;
  }

  const { doi_url, contributors, created_timestamp, title } = entity;

  if (!doi_url || !contributors || !title || !created_timestamp) {
    return null;
  }

  const doi = getCollectionDOI(doi_url);

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
  isEntityHeader = false,
  direction = 'column',
  published_timestamp,
  created_timestamp,
  description,
  ...stackProps
}: { isEntityHeader?: boolean } & Partial<StackProps> &
  Pick<Entity, 'description' | 'created_timestamp' | 'published_timestamp'>) {
  const creationLabel = published_timestamp ? 'Publication Date' : 'Creation Date';
  const creationTimestamp = published_timestamp ?? created_timestamp;

  const { entity } = useFlaskDataContext();

  if (isPublication(entity)) {
    return (
      <Stack component={SummaryPaper} direction={direction} spacing={1} {...stackProps}>
        <PublicationSummaryBody isEntityHeader={isEntityHeader} />
      </Stack>
    );
  }

  return (
    <Stack component={SummaryPaper} direction={direction} spacing={1} {...stackProps}>
      <CollectionName />
      <SummaryDescription description={description} clamp={isEntityHeader} />
      <DatasetConsortium />
      <DatasetCitation />
      <CollectionCitation />
      <StyledCreationDate label={creationLabel} timestamp={creationTimestamp} />
    </Stack>
  );
}

function SummaryBody({ isEntityHeader = false, ...stackProps }: { isEntityHeader?: boolean } & Partial<StackProps>) {
  const { entity } = useFlaskDataContext();

  const { created_timestamp, published_timestamp, description } = entity;

  return (
    <SummaryBodyContent
      created_timestamp={created_timestamp}
      published_timestamp={published_timestamp}
      description={description}
      isEntityHeader={isEntityHeader}
      {...stackProps}
    />
  );
}

export { SummaryBodyContent };
export default SummaryBody;
