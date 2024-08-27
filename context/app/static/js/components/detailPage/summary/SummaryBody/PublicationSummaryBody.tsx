import React from 'react';

import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import CorrespondingAuthorsList from 'js/components/publications/CorrespondingAuthorsList/CorrespondingAuthorsList';
import AggsList from 'js/components/publications/AggsList';
import PublicationCitation from 'js/components/publications/PublicationCitation';

import { useFlaskDataContext } from 'js/components/Contexts';
import { isPublication } from 'js/components/types';
import SummaryDescription from './SummaryDescription';

const publishedTooltip = 'Date when article was published in the journal.';
const preprintTooltip = 'Date when article was posted as a preprint.';

function PublicationSummaryBody({ isEntityHeader = false }: { isEntityHeader?: boolean }) {
  const { entity } = useFlaskDataContext();

  if (!isPublication(entity)) {
    return null;
  }

  const {
    title,
    uuid,
    description,
    publication_venue,
    publication_url,
    contributors,
    contacts,
    publication_doi,
    publication_date,
    publication_status: isPublished,

    associated_collection,
  } = entity;

  const doiURL = `https://doi.org/${publication_doi}`;
  const associatedCollectionUUID = associated_collection?.uuid;

  return (
    <>
      {!isEntityHeader && (
        <SummaryDescription label="Abstract" data-testid="publication-abstract" description={description} />
      )}
      <LabelledSectionText label="Manuscript" data-testid="publication-manuscript-link">
        {publication_venue}: <OutboundIconLink href={publication_url}>{publication_url}</OutboundIconLink>
      </LabelledSectionText>
      {!isEntityHeader && (
        <PublicationCitation
          contributors={contributors}
          publication_date={publication_date}
          publication_venue={publication_venue}
          title={title}
          doiURL={doiURL}
        />
      )}
      {contacts && !isEntityHeader && (
        <LabelledSectionText
          iconTooltipText="The author(s) responsible for handling all correspondence about this article. Contact this author for any inquiries about this publication."
          label="Corresponding Authors"
          childContainerComponent="div"
        >
          <CorrespondingAuthorsList contacts={contacts} />
        </LabelledSectionText>
      )}
      <LabelledSectionText
        label="Data Types"
        iconTooltipText="The assays involved in this publication."
        childContainerComponent="div"
        data-testid="publication-data-types"
      >
        <AggsList uuid={uuid} field="mapped_data_types" associatedCollectionUUID={associatedCollectionUUID} />
      </LabelledSectionText>
      <LabelledSectionText label="Organs" childContainerComponent="div" data-testid="publication-organs">
        <AggsList uuid={uuid} field="origin_samples.mapped_organ" associatedCollectionUUID={associatedCollectionUUID} />
      </LabelledSectionText>
      <LabelledSectionText
        label={isPublished ? 'Publication Date' : 'Preprint Date'}
        iconTooltipText={isPublished ? publishedTooltip : preprintTooltip}
        data-testid="publication-date"
      >
        {publication_date}
      </LabelledSectionText>
    </>
  );
}

export default PublicationSummaryBody;
