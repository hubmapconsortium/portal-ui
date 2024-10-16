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
          // Manually scroll to section and account for header offset
          const sectionTop = sectionRef.current?.getBoundingClientRect().top ?? 0;
          const scrollPosition = window.scrollY + sectionTop - offset;

          window.scrollTo({
            top: Math.max(scrollPosition, 0),
            behavior: 'smooth',
          });
        }, 1000);
      }
    }
    // We do not want to re-scroll down to the section if the header view changes (aka offset changes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialHash, rest.id]);

  return (
    <OffsetSection $offset={offset} ref={sectionRef} {...rest}>
      {children}
    </OffsetSection>
  );
}

export default DetailPageSection;
