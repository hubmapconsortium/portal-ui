import React from 'react';
import PropTypes from 'prop-types';

import Dropdown from '../Dropdown';
import DropdownLink from '../DropdownLink';
import { StyledDivider } from '../HeaderContent/style';
import { TruncatedSpan, WarningDropdownLink } from './style';

const unconditionalLinks = (
  <>
    <DropdownLink href="/my-lists">My Lists</DropdownLink>
    <StyledDivider />
  </>
);

function UserLinks(props) {
  const { isAuthenticated, userEmail } = props;

  return isAuthenticated ? (
    <Dropdown title={<TruncatedSpan>{userEmail || 'User'}</TruncatedSpan>}>
      {unconditionalLinks}
      <WarningDropdownLink href="/logout">Log Out</WarningDropdownLink>
    </Dropdown>
  ) : (
    <Dropdown title="User Profile">
      {unconditionalLinks}
      <DropdownLink href="/login">Log In</DropdownLink>
    </Dropdown>
  );
}

UserLinks.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default UserLinks;
