import React from 'react';
import InfoIcon from '@material-ui/icons/Info';

import { DetailPageSection } from 'js/components/detailPage/style';
import EmailIconLink from 'js/shared-styles/Links/iconLinks/EmailIconLink';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { FlexPaper, StyledSectionHeader } from './style';
import SectionItem from '../SectionItem';

function Attribution({ group_name, created_by_user_displayname, created_by_user_email }) {
  return (
    <DetailPageSection id="attribution">
      <StyledSectionHeader>
        Attribution
        <SecondaryBackgroundTooltip title="Information about the group registering this donor.">
          <InfoIcon fontSize="small" color="primary" />
        </SecondaryBackgroundTooltip>
      </StyledSectionHeader>
      <FlexPaper>
        <SectionItem label="Group">{group_name}</SectionItem>
        <SectionItem label="Registered by" ml={1}>
          {created_by_user_displayname}
          <EmailIconLink email={encodeURI(created_by_user_email)} iconFontSize="1.1rem">
            {created_by_user_email}
          </EmailIconLink>
        </SectionItem>
      </FlexPaper>
    </DetailPageSection>
  );
}

// Attribution.propTypes = {};

export default React.memo(Attribution);
