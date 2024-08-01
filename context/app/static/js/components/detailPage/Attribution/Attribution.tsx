import React from 'react';

import { useFlaskDataContext } from 'js/components/Contexts';
import { DetailPageSection } from 'js/components/detailPage/style';
import EmailIconLink from 'js/shared-styles/Links/iconLinks/EmailIconLink';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { InfoIcon } from 'js/shared-styles/icons';
import Paper from '@mui/material/Paper';
import SectionItem from '../SectionItem';
import { FlexPaper } from './style';

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

  const isHiveProcessedDataset =
    entity_type === 'Dataset' && processing === 'processed' && creation_action === 'Central Process';

  const infoAlert = (
    <Stack component={Paper} p={2} spacing={2} marginBottom={1.25}>
      <Stack direction="row" spacing={2}>
        <InfoIcon color="primary" fontSize="1.5rem" />
        <Typography>
          {`The data provided by the ${group_name} Group was centrally processed by HuBMAP. The results of this processing are independent of analyses conducted by the data providers or third parties.`}
        </Typography>
      </Stack>
    </Stack>
  );

  return (
    <DetailPageSection id="attribution">
      <SectionHeader
        iconTooltipText={
          isHiveProcessedDataset
            ? undefined
            : `Information about the group registering this ${entity_type?.toLowerCase()}.`
        }
      >
        Attribution
      </SectionHeader>
      {isHiveProcessedDataset && infoAlert}
      <FlexPaper>
        <SectionItem label="Group">{group_name}</SectionItem>
        <SectionItem label="Registered by" ml>
          {created_by_user_displayname}
          <EmailIconLink email={encodeURI(created_by_user_email)} iconFontSize="1.1rem">
            {created_by_user_email}
          </EmailIconLink>
        </SectionItem>
      </FlexPaper>
    </DetailPageSection>
  );
}

export default React.memo(Attribution);
