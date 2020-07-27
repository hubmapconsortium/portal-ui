import React from 'react';
import PropTypes from 'prop-types';

import { LightBlueLink } from 'shared-styles/Links';
import { FlexPaper } from './style';
import SectionHeader from '../SectionHeader';
import SectionContainer from '../SectionContainer';
import SectionItem from '../SectionItem';

function Attribution(props) {
  const { group_name, created_by_user_displayname, created_by_user_email } = props;

  return (
    <SectionContainer id="attribution">
      <SectionHeader>Attribution</SectionHeader>
      <FlexPaper>
        <SectionItem label="Center">{group_name}</SectionItem>
        <SectionItem label="Contact" ml={1}>
          {created_by_user_displayname}
          <LightBlueLink href={`mailto:${encodeURI(created_by_user_email)}`}>{created_by_user_email}</LightBlueLink>
        </SectionItem>
      </FlexPaper>
    </SectionContainer>
  );
}

Attribution.propTypes = {
  group_name: PropTypes.string.isRequired,
  created_by_user_displayname: PropTypes.string.isRequired,
  created_by_user_email: PropTypes.string.isRequired,
};

export default React.memo(Attribution);
