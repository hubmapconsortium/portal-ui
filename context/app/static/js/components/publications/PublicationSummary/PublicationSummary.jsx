import React from 'react';

import { DetailPageSection } from 'js/components/detailPage/style';
import SummaryData from 'js/components/detailPage/summary/SummaryData';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import SectionPaper from 'js/shared-styles/sections/SectionPaper';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import SummaryItem from 'js/components/detailPage/summary/SummaryItem';
import CorrespondingAuthorsList from 'js/components/publications/CorrespondingAuthorsList/CorrespondingAuthorsList';
import AggsList from 'js/components/publications/AggsList';

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
  contacts,
  hasDOI,
  doi_url,
  hubmap_id,
  publication_date,
}) {
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
        {hasDOI && <OutboundIconLink href={doi_url}>{doi_url}</OutboundIconLink>}
      </SummaryData>
      <SectionPaper>
        <LabelledSectionText label="Abstract" bottomSpacing={2}>
          {description}
        </LabelledSectionText>
        <LabelledSectionText label="Manuscript" bottomSpacing={2}>
          {publication_venue}: <OutboundIconLink href={publication_url}>{publication_url}</OutboundIconLink>
        </LabelledSectionText>
        <LabelledSectionText label="Corresponding Authors" bottomSpacing={1}>
          <CorrespondingAuthorsList contacts={contacts} />
        </LabelledSectionText>
        <LabelledSectionText label="Data Types" bottomSpacing={1}>
          <AggsList uuid={uuid} field="mapped_data_types" />
        </LabelledSectionText>
        <LabelledSectionText label="Organs" bottomSpacing={1}>
          <AggsList uuid={uuid} field="mapped_organ" />
        </LabelledSectionText>
        <LabelledSectionText label="Publication Date" bottomSpacing={1}>
          {publication_date}
        </LabelledSectionText>
      </SectionPaper>
    </DetailPageSection>
  );
}

export default PublicationSummary;
