import React from 'react';

import { useFlaskDataContext } from 'js/components/Contexts';
import { DetailPageSection } from 'js/components/detailPage/style';
import EmailIconLink from 'js/shared-styles/Links/iconLinks/EmailIconLink';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import SummaryPaper from 'js/shared-styles/sections/SectionPaper';
import { InfoIcon } from 'js/shared-styles/icons';
import LabelledSectionText from 'js/shared-styles/sections/LabelledSectionText';
import ContactUsLink from 'js/shared-styles/Links/ContactUsLink';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

function Attribution() {
  const {
    entity: {
      group_name,
      created_by_user_displayname,
      created_by_user_email,
      entity_type,
      processing,
      creation_action,
    },
  } = useFlaskDataContext();

  const isProcessedDataset = entity_type === 'Dataset' && processing === 'processed';
  const isHiveProcessedDataset = isProcessedDataset && creation_action === 'Central Process';

  const tooltips = {
    group: 'This is the group that provided the raw dataset.',
    contact: 'This is the contact for this data.',
  };

  const hiveInfoAlertText = `The data provided by the ${group_name} Group was centrally processed by HuBMAP. The results of this processing are independent of analyses conducted by the data providers or third parties.`;

  const hiveInfoAlert = (
    <Stack component={Paper} p={2} spacing={2} marginBottom={1.25}>
      <Stack direction="row" spacing={2}>
        <InfoIcon color="primary" fontSize="1.5rem" />
        <Typography>{hiveInfoAlertText}</Typography>
      </Stack>
    </Stack>
  );

  const sections: {
    label: string;
    text: React.ReactNode;
    tooltip?: string;
  }[] = [
    {
      label: 'Group',
      text: group_name,
      tooltip: isProcessedDataset ? tooltips.group : undefined,
    },
  ];

  if (!isProcessedDataset) {
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
  } else if (isHiveProcessedDataset) {
    sections.push({
      label: 'Contact',
      text: <ContactUsLink> HuBMAP Help Desk </ContactUsLink>,
      tooltip: tooltips.contact,
    });
  }

  return (
    <DetailPageSection id="attribution">
      <SectionHeader
        iconTooltipText={
          isProcessedDataset ? undefined : `Information about the group registering this ${entity_type?.toLowerCase()}.`
        }
      >
        Attribution
      </SectionHeader>
      {isHiveProcessedDataset && hiveInfoAlert}
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
