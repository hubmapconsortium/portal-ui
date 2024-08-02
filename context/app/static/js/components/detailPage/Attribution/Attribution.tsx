import React from 'react';

import Stack from '@mui/material/Stack';

import { useFlaskDataContext } from 'js/components/Contexts';
import { DetailPageSection } from 'js/components/detailPage/style';
import EmailIconLink from 'js/shared-styles/Links/iconLinks/EmailIconLink';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';
import InfoAlert from 'js/shared-styles/alerts/InfoAlert';

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

  const showContactAndAlert = isHiveProcessedDataset ?? isSupportDataset;
  const showRegisteredBy = !(isProcessedDataset ?? isVisLiftedDataset ?? isHiveProcessedDataset ?? isSupportDataset);

  const tooltips = {
    group: 'This is the group that provided the raw dataset.',
    contact: 'This is the contact for this data.',
  };

  const hiveInfoAlertText = `The data provided by the ${group_name} Group was centrally processed by HuBMAP. The results of this processing are independent of analyses conducted by the data providers or third parties.`;

  const sections: {
    label: string;
    text: React.ReactNode;
    tooltip?: string;
  }[] = [
    {
      label: 'Group',
      text: group_name,
      tooltip: showRegisteredBy ? undefined : tooltips.group,
    },
  ];

  if (showContactAndAlert) {
    sections.push({
      label: 'Contact',
      text: <ContactUsLink> HuBMAP Help Desk </ContactUsLink>,
      tooltip: tooltips.contact,
    });
  } else if (showRegisteredBy) {
    sections.push({
      label: 'Registered by',
      text: (
        <Stack spacing={1}>
          {created_by_user_displayname}
          <EmailIconLink email={encodeURI(created_by_user_email)} iconFontSize="1.1rem">
            {created_by_user_email}
          </EmailIconLink>
        </Stack>
      ),
    });
  }

  return (
    <DetailPageSection id="attribution">
      <SectionHeader
        iconTooltipText={
          showRegisteredBy ? `Information about the group registering this ${entity_type?.toLowerCase()}.` : undefined
        }
      >
        Attribution
      </SectionHeader>
      {showContactAndAlert && <InfoAlert text={hiveInfoAlertText} />}
      <SummaryPaper>
        <Stack direction="row" spacing={10}>
          {sections.map(({ label, text, tooltip }) => (
            <LabelledSectionText key={label} label={label} iconTooltipText={tooltip}>
              {text}
            </LabelledSectionText>
          ))}
        </Stack>
      </SummaryPaper>
    </DetailPageSection>
  );
}

export default React.memo(Attribution);
