import React from 'react';
import PropTypes from 'prop-types';

import { LightBlueLink } from 'js/shared-styles/Links';
import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import PaddedSectionContainer from 'js/shared-styles/sections/PaddedSectionContainer';
import { FlexPaper } from './style';
import SectionItem from '../SectionItem';

function Attribution(props) {
  const { group_name, created_by_user_displayname, created_by_user_email } = props;

  return (
    <PaddedSectionContainer id="attribution">
      <SectionHeader>Attribution</SectionHeader>
      <FlexPaper>
        <SectionItem label="Group">{group_name}</SectionItem>
        <SectionItem label="Creator" ml={1}>
          {created_by_user_displayname}
          <LightBlueLink href={`mailto:${encodeURI(created_by_user_email)}`}>{created_by_user_email}</LightBlueLink>
        </SectionItem>
      </FlexPaper>
    </PaddedSectionContainer>
  );
}

Attribution.propTypes = {
  group_name: PropTypes.string.isRequired,
  created_by_user_displayname: PropTypes.string.isRequired,
  created_by_user_email: PropTypes.string.isRequired,
};

export default React.memo(Attribution);
