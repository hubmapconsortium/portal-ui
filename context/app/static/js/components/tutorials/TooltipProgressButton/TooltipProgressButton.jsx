import React, { useEffect } from 'react';

import { WhiteTextButton } from 'js/shared-styles/buttons';

function TooltipProgressButton({ eventHandler, eventKeyCode, children }) {
  useEffect(() => {
    function onKeydown(event) {
      if (event.keyCode === eventKeyCode) {
        eventHandler();
      }
    }
    window.addEventListener('keydown', onKeydown);
    return () => {
      window.removeEventListener('keydown', onKeydown);
    };
  }, [eventHandler, eventKeyCode]);
  return <WhiteTextButton onClick={() => eventHandler()}>{children}</WhiteTextButton>;
}

export default TooltipProgressButton;
