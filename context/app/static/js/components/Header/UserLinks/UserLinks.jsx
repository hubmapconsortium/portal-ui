import React from 'react';
import PropTypes from 'prop-types';

import Dropdown from '../Dropdown';
import DropdownLink from '../DropdownLink';
import { StyledDivider } from '../HeaderContent/style';
import { TruncatedSpan } from './style';

function LoginMenu(props) {
  const { isAuthenticated, userEmail } = props;

  const displayName = userEmail || 'User';

  return isAuthenticated ? (
    <Dropdown title={<TruncatedSpan>{displayName}</TruncatedSpan>}>
      <DropdownLink href="/my-lists">My Lists</DropdownLink>
      <StyledDivider />
      <DropdownLink href="/logout">Log Out</DropdownLink>
    </Dropdown>
  ) : (
    <Dropdown title="User Profile">
      <DropdownLink href="/my-lists">My Lists</DropdownLink>
      <StyledDivider />
      <DropdownLink href="/login">Log In</DropdownLink>
    </Dropdown>
  );
}

LoginMenu.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default LoginMenu;
