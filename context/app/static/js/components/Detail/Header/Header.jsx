import React from 'react';
import { useTransition, animated } from 'react-spring';

import { HeaderPaper } from './style';

const AnimatedPaper = animated(HeaderPaper);

function Header() {
  const transitions = useTransition([true], null, {
    from: { overflow: 'hidden', height: 0 },
    enter: { height: 40 },
    leave: { height: 0 },
  });

  return transitions.map(
    ({ item, key, props }) =>
      item && (
        <AnimatedPaper key={key} style={props}>
          asdasd
        </AnimatedPaper>
      ),
  );
}

export default Header;
