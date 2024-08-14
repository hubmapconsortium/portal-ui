import React, { PropsWithChildren } from 'react';

import Stack from '@mui/material/Stack';

import { useFlaskDataContext } from 'js/components/Contexts';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import { OutlinedAlert } from 'js/shared-styles/alerts/OutlinedAlert.stories';

import { isDataset } from 'js/components/types';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import { useAttributionSections } from '../ContributorsTable/hooks';
import { SectionDescription } from '../ProcessedData/ProcessedDataset/SectionDescription';

const tooltips = {
  group: 'This is the group that submitted the raw dataset to be published.',
  contact: 'This is the contact for this data.',
};

const DatasetAttribution = (
  <SectionDescription>
    Below is the information for the individuals who provided this dataset. For questions for this dataset, reach out to
    the individuals listed as contacts, either via the email address listed in the table or via contact information
    provided on their ORCID profile page.
  </SectionDescription>
);

function Attribution({ children }: PropsWithChildren) {
  const {
    entity: {
      group_name,
      created_by_user_displayname,
      created_by_user_email,
      entity_type,
      processing,
      creation_action,
      descendants,
    },
  } = useFlaskDataContext();

  const isProcessedDataset = entity_type === 'Dataset' && processing === 'processed';
  const isVisLiftedDataset = descendants?.find((descendant) => descendant.dataset_type === 'Histology [Image Pyramid]');
  const isHiveProcessedDataset = isProcessedDataset && creation_action === 'Central Process';
  const isSupportDataset = entity_type === 'Support';

  const showContactAndAlert = isHiveProcessedDataset || isSupportDataset;
  const showRegisteredBy = !isProcessedDataset && !isVisLiftedDataset && !isHiveProcessedDataset && !isSupportDataset;

  const hiveInfoAlertText = `The data provided by the ${group_name} Group was centrally processed by HuBMAP. The results of this processing are independent of analyses conducted by the data providers or third parties.`;

  const sections = useAttributionSections(
    group_name,
    created_by_user_displayname,
    created_by_user_email,
    tooltips,
    showRegisteredBy,
    showContactAndAlert,
  );

  const entityIsDataset = isDataset({ entity_type });

  return (
    <CollapsibleDetailPageSection id="attribution" title="Attribution" icon={sectionIconMap.attribution}>
      <Stack spacing={1}>
        {entityIsDataset && DatasetAttribution}
        {showContactAndAlert && <OutlinedAlert severity="info">{hiveInfoAlertText}</OutlinedAlert>}
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
