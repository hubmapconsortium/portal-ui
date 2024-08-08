import React, { PropsWithChildren } from 'react';
import Stack, { StackProps } from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import Citation from 'js/components/detailPage/Citation';
import { LineClamp } from 'js/shared-styles/text';
import { Entity, isCollection, isDataset } from 'js/components/types';
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
    <Typography variant="h6" component="h3">
      {title}
    </Typography>
  );
}

function CustomClamp({ children }: PropsWithChildren) {
  return (
    <LineClamp lines={3} component={Typography}>
      {children}
    </LineClamp>
  );
}

function Description({ description, clamp }: { clamp?: boolean } & Pick<Entity, 'description'>) {
  if (!description) {
    return null;
  }

  return (
    <LabelledSectionText label="Description" childContainerComponent={clamp ? CustomClamp : undefined}>
      {description}
    </LabelledSectionText>
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
  clamp,
  direction = 'column',
  published_timestamp,
  created_timestamp,
  description,
  ...stackProps
}: { clamp?: boolean } & Partial<StackProps> &
  Pick<Entity, 'description' | 'created_timestamp' | 'published_timestamp'>) {
  const creationLabel = published_timestamp ? 'Publication Date' : 'Creation Date';
  const creationTimestamp = published_timestamp ?? created_timestamp;

  return (
    <Stack component={SummaryPaper} direction={direction} spacing={1} {...stackProps}>
      <CollectionName />
      <Description description={description} clamp={clamp} />
      <DatasetConsortium />
      <DatasetCitation />
      <CollectionCitation />
      <StyledCreationDate label={creationLabel} timestamp={creationTimestamp} />
    </Stack>
  );
}

function SummaryBody({ clamp, ...stackProps }: { clamp?: boolean } & Partial<StackProps>) {
  const { entity } = useFlaskDataContext();

  const { created_timestamp, published_timestamp, description } = entity;

  return (
    <SummaryBodyContent
      created_timestamp={created_timestamp}
      published_timestamp={published_timestamp}
      description={description}
      clamp={clamp}
      {...stackProps}
    />
  );
}

export { SummaryBodyContent };
export default SummaryBody;
