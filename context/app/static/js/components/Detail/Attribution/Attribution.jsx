import React from 'react';
import PropTypes from 'prop-types';
import { StyledTypography, StyledLink, FlexPaper } from './style';
import SectionHeader from '../SectionHeader';
import SectionContainer from '../SectionContainer';
import SectionItem from '../SectionItem';

function Attribution(props) {
  const { group_name, created_by_user_displayname, created_by_user_email } = props;

  return (
    <SectionContainer id="attribution">
      <SectionHeader variant="h3" component="h2">
        Attribution
      </SectionHeader>
      <FlexPaper>
        <SectionItem label="Center">
          <StyledTypography variant="body1">{group_name}</StyledTypography>
        </SectionItem>
        <SectionItem label="Creator" ml={1}>
          <StyledTypography variant="body1">{created_by_user_displayname}</StyledTypography>
          <StyledLink href={`mailto:${encodeURI(created_by_user_email)}`}>{created_by_user_email}</StyledLink>
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
