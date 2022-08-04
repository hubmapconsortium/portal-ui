import React from 'react';
import PropTypes from 'prop-types';

import Dropdown from '../Dropdown';
import DropdownLink from '../DropdownLink';
import { StyledDivider } from '../HeaderContent/style';
import { TruncatedSpan, WarningSpan } from './style';

function UserLinks(props) {
  const { isAuthenticated, userEmail } = props;

  const displayName = userEmail || 'User';

  return isAuthenticated ? (
    <Dropdown title={<TruncatedSpan>{displayName}</TruncatedSpan>}>
      <DropdownLink href="/my-lists">My Lists</DropdownLink>
      <StyledDivider />
      <DropdownLink href="/logout">
        <WarningSpan>Log Out</WarningSpan>
      </DropdownLink>
    </Dropdown>
  ) : (
    <Dropdown title="User Profile">
      <DropdownLink href="/my-lists">My Lists</DropdownLink>
      <StyledDivider />
      <DropdownLink href="/login">Log In</DropdownLink>
    </Dropdown>
  );
}

UserLinks.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default UserLinks;
