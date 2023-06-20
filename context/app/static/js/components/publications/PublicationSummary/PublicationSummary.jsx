import React from 'react';

import { DetailPageSection } from 'js/components/detailPage/style';
import SummaryData from 'js/components/detailPage/summary/SummaryData';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import SummaryItem from 'js/components/detailPage/summary/SummaryItem';
import CorrespondingAuthorsList from 'js/components/publications/CorrespondingAuthorsList/CorrespondingAuthorsList';
import AggsList from 'js/components/publications/AggsList';
import PublicationCitation from 'js/components/publications/PublicationCitation';

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
}) {
  const hasDOI = Boolean(publication_doi);
  const doiURL = `https://doi.org/${publication_doi}`;

  return (
    <DetailPageSection id="summary">
      <SummaryData
        title={title}
        entity_type={entity_type}
        uuid={uuid}
        status={status}
        mapped_data_access_level={mapped_data_access_level}
        entityCanBeSaved={entityCanBeSaved}
        mapped_external_group_name={mapped_external_group_name}
      >
        <SummaryItem showDivider={hasDOI}>{hubmap_id}</SummaryItem>
        {hasDOI && (
          <SummaryItem showDivider={hasDOI}>
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
          <LabelledSectionText label="Corresponding Authors" bottomSpacing={2} childContainerComponent="div">
            <CorrespondingAuthorsList contacts={contacts} />
          </LabelledSectionText>
        )}
        <LabelledSectionText
          label="Data Types"
          bottomSpacing={2}
          childContainerComponent="div"
          data-testid="publication-data-types"
        >
          <AggsList uuid={uuid} field="mapped_data_types" />
        </LabelledSectionText>
        <LabelledSectionText
          label="Organs"
          bottomSpacing={2}
          childContainerComponent="div"
          data-testid="publication-organs"
        >
          <AggsList uuid={uuid} field="mapped_organ" />
        </LabelledSectionText>
        <LabelledSectionText label="Publication Date" bottomSpacing={2} data-testid="publication-date">
          {publication_date}
        </LabelledSectionText>
      </SectionPaper>
    </DetailPageSection>
  );
}

export default PublicationSummary;
