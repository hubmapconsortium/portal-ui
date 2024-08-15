import React from 'react';

import Stack from '@mui/material/Stack';

import { useFlaskDataContext } from 'js/components/Contexts';
import { DetailPageSection } from 'js/components/detailPage/style';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import IconPanel from 'js/shared-styles/panels/IconPanel';

import { useAttributionSections } from '../ContributorsTable/hooks';

const tooltips = {
  group: 'This is the group that provided the raw dataset.',
  contact: 'This is the contact for this data.',
};

function Attribution() {
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

  const hiveIconPanelText = `The data provided by the ${group_name} Group was centrally processed by HuBMAP. The results of this processing are independent of analyses conducted by the data providers or third parties.`;
  const iconTooltipText = showRegisteredBy
    ? `Information about the group registering this ${entity_type?.toLowerCase()}.`
    : undefined;

  const sections = useAttributionSections(
    group_name,
    created_by_user_displayname,
    created_by_user_email,
    tooltips,
    showRegisteredBy,
    showContactAndAlert,
  );

  return (
    <DetailPageSection id="attribution">
      <Stack spacing={1}>
        <SectionHeader iconTooltipText={iconTooltipText}>Attribution</SectionHeader>
        {showContactAndAlert && <IconPanel status="info">{hiveIconPanelText}</IconPanel>}
        <SummaryPaper>
          <Stack direction="row" spacing={10}>
            {sections.map((props) => (
              <LabelledSectionText key={props.label} iconTooltipText={props.tooltip} {...props} />
            ))}
          </Stack>
        </SummaryPaper>
      </Stack>
    </DetailPageSection>
  );
}

export default React.memo(Attribution);
