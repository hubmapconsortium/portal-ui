import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import { capitalizeString } from 'helpers/functions';
import { WhiteButton, Link } from './style';

function LoginButton(props) {
  const { isAuthenticated } = props;

  const link = isAuthenticated ? 'logout' : 'login';

  return (
    <WhiteButton>
      <Link href={`/${link}`}> {capitalizeString(link)} </Link>
    </WhiteButton>
  );
}

LoginButton.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default React.memo(LoginButton);
