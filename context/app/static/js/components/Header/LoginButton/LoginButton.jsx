import React from 'react';
import PropTypes from 'prop-types';
import { WhiteButton } from './style';

function LoginButton(props) {
  const { isAuthenticated, nexusToken } = props;

  const link = isAuthenticated && nexusToken ? 'logout' : 'login';

  return (
    <WhiteButton component="a" href={`/${link}`}>
      {link}
    </WhiteButton>
  );
}

LoginButton.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default LoginButton;
