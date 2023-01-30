import React, { useEffect } from 'react';

import { WhiteTextButton } from 'js/shared-styles/buttons';

function TooltipProgressButton({ eventHandler, triggerKeyCode, children, disabled }) {
  useEffect(() => {
    function onKeydown(event) {
      if (event.keyCode === triggerKeyCode) {
        eventHandler();
      }
    }
    window.addEventListener('keydown', onKeydown);
    return () => {
      window.removeEventListener('keydown', onKeydown);
    };
  }, [eventHandler, triggerKeyCode]);
  return (
    <WhiteTextButton disabled={disabled} onClick={() => eventHandler()}>
      {children}
    </WhiteTextButton>
  );
}

export default TooltipProgressButton;
