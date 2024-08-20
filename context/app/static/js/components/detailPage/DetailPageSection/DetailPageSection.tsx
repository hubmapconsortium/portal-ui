import React, { PropsWithChildren, useEffect, useRef } from 'react';

import { useInitialHashContext } from 'js/hooks/useInitialHash';
import { useTotalHeaderOffset } from '../entityHeader/EntityHeader/hooks';
import { OffsetSection } from '../style';

function DetailPageSection({ children, ...rest }: PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
  const offset = useTotalHeaderOffset();

  const sectionRef = useRef<HTMLElement>(null);
  const initialHash = useInitialHashContext();

  useEffect(() => {
    if (initialHash && initialHash?.length > 1) {
      const strippedHash = initialHash.slice(1);
      if (strippedHash === rest.id) {
        setTimeout(() => {
          sectionRef.current?.scrollIntoView({
            behavior: 'smooth',
          });
        }, 1000);
      }
    }
  }, [initialHash, rest.id]);

  return (
    <OffsetSection $offset={offset} ref={sectionRef} {...rest}>
      {children}
    </OffsetSection>
  );
}

export default DetailPageSection;
