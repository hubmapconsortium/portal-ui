import React, { PropsWithChildren } from 'react';

import Stack from '@mui/material/Stack';

import { useFlaskDataContext } from 'js/components/Contexts';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';

import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import { useAttributionSections } from '../ContributorsTable/hooks';
import { SectionDescription } from '../ProcessedData/ProcessedDataset/SectionDescription';

const tooltips = {
  group: 'This is the group that submitted the raw dataset to be published.',
  contact: 'This is the contact for this data.',
};

const DatasetAttribution = (
  <SectionDescription>
    Below is the information for the individuals who provided this dataset. For questions about this dataset, reach out
    to the individuals listed as contacts, either via the email address listed in the table or via contact information
    provided on their ORCID profile page.
  </SectionDescription>
);

function Attribution({ children }: PropsWithChildren) {
  const {
    entity: { group_name, created_by_user_displayname, created_by_user_email, entity_type },
  } = useFlaskDataContext();

  const isDataset = entity_type === 'Dataset';

  const showRegisteredBy = !isDataset;

  const sections = useAttributionSections(
    group_name,
    created_by_user_displayname,
    created_by_user_email,
    tooltips,
    showRegisteredBy,
  );

  return (
    <CollapsibleDetailPageSection id="attribution" title="Attribution" icon={sectionIconMap.attribution}>
      <Stack spacing={1}>
        {isDataset && DatasetAttribution}
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
