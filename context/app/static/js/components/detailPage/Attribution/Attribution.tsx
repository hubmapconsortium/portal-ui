import React, { PropsWithChildren } from 'react';

import Stack from '@mui/material/Stack';

import { useFlaskDataContext } from 'js/components/Contexts';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import { SectionDescription } from 'js/shared-styles/sections/SectionDescription';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import { useAttributionSections } from '../ContributorsTable/hooks';

const tooltips = {
  group: 'This is the group that submitted the raw dataset to be published.',
  contact: 'This is the contact for this data.',
};

const tooltipsIntegrated = {
  ...tooltips,
  contact: 'Contact the HuBMAP Help Desk with any questions about the analysis of this data.',
};

export const DatasetAttributionDescription = (
  <SectionDescription>
    Below is the information for the individuals who provided this dataset. For questions about this dataset, reach out
    to the individuals listed as contacts, either via the email address listed in the table or via contact information
    provided on their ORCID profile page.
  </SectionDescription>
);

interface IntegratedDatasetAttributionDescriptionProps {
  group: string;
}

const IntegratedDatasetAttributionDescription = ({ group }: IntegratedDatasetAttributionDescriptionProps) => (
  <SectionDescription>
    The data provided by the {group} Group was centrally processed by HuBMAP. The results of this processing are
    independent of analyses conducted by the data providers or third parties.
  </SectionDescription>
);

const ExternalDatasetAttributionDescription = (
  <SectionDescription>
    Below is the information for the individuals who provided and analyzed this dataset. For questions about this
    dataset, reach out to the individuals listed as contacts, either via the email address listed in the table or via
    contact information provided on their ORCID profile page.
  </SectionDescription>
);

function AttributionDescription() {
  const {
    entity: { is_integrated, creation_action, group_name },
  } = useFlaskDataContext();

  const isExternal = creation_action === 'External Process';
  if (isExternal) return ExternalDatasetAttributionDescription;
  if (is_integrated) return <IntegratedDatasetAttributionDescription group={group_name} />;
  return DatasetAttributionDescription;
}

function Attribution({ children }: PropsWithChildren) {
  const {
    entity: { group_name, created_by_user_displayname, creation_action, created_by_user_email, entity_type },
  } = useFlaskDataContext();

  const isDataset = entity_type === 'Dataset';
  const isInternalIntegrated = isDataset && creation_action !== 'External Process';

  const showRegisteredBy = !isDataset;

  const sections = useAttributionSections(
    group_name,
    created_by_user_displayname,
    created_by_user_email,
    isInternalIntegrated ? tooltipsIntegrated : tooltips,
    showRegisteredBy,
    isInternalIntegrated,
  );

  return (
    <CollapsibleDetailPageSection id="attribution" title="Attribution" icon={sectionIconMap.attribution}>
      <Stack spacing={1}>
        {isDataset && <AttributionDescription />}
        <SummaryPaper>
          <Stack direction="row" spacing={10}>
            {sections.map((props) => (
              <LabelledSectionText key={props.label} iconTooltipText={props.tooltip} {...props} />
            ))}
          </Stack>
        </SummaryPaper>
        {children}
      </Stack>
    </CollapsibleDetailPageSection>
  );
}

export default React.memo(Attribution);
