import React from 'react';
import Stack, { StackProps } from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import Citation from 'js/components/detailPage/Citation';
import { isCollection, isDataset, isPublication } from 'js/components/types';
import { SavedEntitiesList } from 'js/components/savedLists/types';
import { useFlaskDataContext } from 'js/components/Contexts';
import { getCollectionDOI } from 'js/pages/Collection/utils';
import { getEntityCreationInfo } from 'js/helpers/functions';
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

function DatasetGroup() {
  const { entity } = useFlaskDataContext();

  if (!isDataset(entity)) {
    return null;
  }

  const { group_name } = entity;

  if (!group_name) {
    return null;
  }

  return <LabelledSectionText label="Group">{group_name}</LabelledSectionText>;
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
      internalDoi
    />
  );
}

function SummaryBodyContent({
  isEntityHeader = false,
  direction = 'column',
  description: propDescription,
  creationLabel: propCreationLabel,
  creationDate: propCreationDate,
  ...stackProps
}: {
  isEntityHeader?: boolean;
  description?: string;
  creationLabel?: string;
  creationDate?: string;
} & Partial<StackProps> &
  Partial<SavedEntitiesList>) {
  const { entity } = useFlaskDataContext();

  // Use description and creation info from props if provided, otherwise use entity data
  const description = propDescription ?? entity.description;
  const { creationLabel, creationDate } =
    propCreationLabel && propCreationDate
      ? { creationLabel: propCreationLabel, creationDate: propCreationDate }
      : getEntityCreationInfo(entity);

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
      <DatasetGroup />
      <DatasetConsortium />
      <DatasetCitation />
      <CollectionCitation />
      <StyledCreationDate label={creationLabel}>{creationDate}</StyledCreationDate>
    </Stack>
  );
}

function SummaryBody({ isEntityHeader = false, ...stackProps }: { isEntityHeader?: boolean } & Partial<StackProps>) {
  return <SummaryBodyContent isEntityHeader={isEntityHeader} {...stackProps} />;
}

export { SummaryBodyContent };
export default SummaryBody;
