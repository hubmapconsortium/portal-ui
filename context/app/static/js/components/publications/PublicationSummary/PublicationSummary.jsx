import React from 'react';

import { format } from 'date-fns/format';

import { DetailPageSection } from 'js/components/detailPage/style';
import SummaryData from 'js/components/detailPage/summary/SummaryData';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import SummaryItem from 'js/components/detailPage/summary/SummaryItem';
import CorrespondingAuthorsList from 'js/components/publications/CorrespondingAuthorsList/CorrespondingAuthorsList';
import AggsList from 'js/components/publications/AggsList';
import PublicationCitation from 'js/components/publications/PublicationCitation';

import { DateContainer } from './style';

const publishedTooltip = 'Date when article was published in the journal.';
const preprintTooltip = 'Date when article was posted as a preprint.';

function PublicationSummary({
  title,
  entity_type,
  uuid,
  status,
  mapped_data_access_level,
  entityCanBeSaved,
  description,
  publication_venue,
  publication_url,
  mapped_external_group_name,
  contributors,
  contacts,
  publication_doi,
  hubmap_id,
  publication_date,
  publication_status: isPublished,
  last_modified_timestamp,
  associatedCollectionUUID,
}) {
  const hasDOI = Boolean(publication_doi);
  const doiURL = `https://doi.org/${publication_doi}`;

  return (
    <DetailPageSection id="summary">
      <SummaryData
        title={title}
        entity_type={entity_type}
        entityTypeDisplay={isPublished ? 'Publication' : 'Preprint'}
        uuid={uuid}
        status={status}
        mapped_data_access_level={mapped_data_access_level}
        entityCanBeSaved={entityCanBeSaved}
        mapped_external_group_name={mapped_external_group_name}
      >
        <SummaryItem showDivider={hasDOI}>{hubmap_id}</SummaryItem>
        {hasDOI && (
          <SummaryItem showDivider={false}>
            <OutboundIconLink href={doiURL}>{doiURL}</OutboundIconLink>
          </SummaryItem>
        )}
      </SummaryData>
      <SectionPaper>
        <LabelledSectionText label="Abstract" bottomSpacing={2} data-testid="publication-abstract">
          {description}
        </LabelledSectionText>
        <LabelledSectionText label="Manuscript" bottomSpacing={2} data-testid="publication-manuscript-link">
          {publication_venue}: <OutboundIconLink href={publication_url}>{publication_url}</OutboundIconLink>
        </LabelledSectionText>
        <PublicationCitation
          contributors={contributors}
          publication_date={publication_date}
          publication_venue={publication_venue}
          title={title}
          doiURL={doiURL}
        />
        {contacts && (
          <LabelledSectionText
            iconTooltipText="The author(s) responsible for handling all correspondence about this article. Contact this author for any inquiries about this publication."
            label="Corresponding Authors"
            bottomSpacing={2}
            childContainerComponent="div"
          >
            <CorrespondingAuthorsList contacts={contacts} />
          </LabelledSectionText>
        )}
        <LabelledSectionText
          label="Data Types"
          iconTooltipText="The assays involved in this publication."
          bottomSpacing={2}
          childContainerComponent="div"
          data-testid="publication-data-types"
        >
          <AggsList uuid={uuid} field="mapped_data_types" associatedCollectionUUID={associatedCollectionUUID} />
        </LabelledSectionText>
        <LabelledSectionText
          label="Organs"
          bottomSpacing={2}
          childContainerComponent="div"
          data-testid="publication-organs"
        >
          <AggsList
            uuid={uuid}
            field="origin_samples.mapped_organ"
            associatedCollectionUUID={associatedCollectionUUID}
          />
        </LabelledSectionText>
        <DateContainer bottomSpacing={2}>
          <LabelledSectionText
            label={isPublished ? 'Publication Date' : 'Preprint Date'}
            iconTooltipText={isPublished ? publishedTooltip : preprintTooltip}
            data-testid="publication-date"
          >
            {publication_date}
          </LabelledSectionText>
          <LabelledSectionText
            label="Last Modified Date"
            iconTooltipText="Date when this page was last updated."
            data-testid="last-modified-date"
          >
            {format(last_modified_timestamp, 'yyyy-MM-dd')}
          </LabelledSectionText>
        </DateContainer>
      </SectionPaper>
    </DetailPageSection>
  );
}

export default PublicationSummary;
