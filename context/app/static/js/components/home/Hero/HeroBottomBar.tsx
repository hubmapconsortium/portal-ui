import React, { Fragment, useCallback, useEffect, useMemo, useRef } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { SelectChangeEvent } from '@mui/material/Select';

import { trackEvent } from 'js/helpers/trackers';
import { headerHeight } from 'js/components/Header/HeaderAppBar/style';
import { BOTTOM_BAR_ITEMS } from './const';
import { PillBar, PillBarOuter, BottomBarLink, BottomBarDivider } from './styles';

function scrollToSection(anchorId: string) {
  const element = document.getElementById(anchorId);
  if (element) {
    const offset = headerHeight + 60; // header + sticky bar height
    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

function MobileBar() {
  const mobileItems = useMemo(() => BOTTOM_BAR_ITEMS.filter((item) => !item.desktopOnly), []);

  const handleChange = useCallback(
    (e: SelectChangeEvent<string>) => {
      const anchorId = e.target.value;
      const item = mobileItems.find((i) => i.anchorId === anchorId);
      if (item) {
        scrollToSection(anchorId);
        trackEvent({ category: 'Homepage', action: `Hero Bottom Bar / ${item.label}` });
      }
    },
    [mobileItems],
  );

  return (
    <Container
      maxWidth="lg"
      sx={(theme) => ({
        position: 'sticky',
        top: 112,
        zIndex: theme.zIndex.appBar - 1,
        py: 1,
      })}
    >
      <Select<string>
        fullWidth
        size="small"
        displayEmpty
        value=""
        onChange={handleChange}
        renderValue={() => 'Jump to section...'}
        sx={{ backgroundColor: 'background.paper' }}
      >
        {mobileItems.map(({ label, anchorId }) => (
          <MenuItem key={anchorId} value={anchorId}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </Container>
  );
}

export default function HeroBottomBar() {
  const outerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return undefined;

    // Sentinel element just above the pill bar's natural position.
    // When it leaves the viewport, the bar has become stuck.
    const sentinel = outer.previousElementSibling as HTMLElement | null;
    if (!sentinel) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        outer.classList.toggle('stuck', !entry.isIntersecting);
      },
      { threshold: 0, rootMargin: `-${headerHeight}px 0px 0px 0px` },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  if (!isDesktop) {
    return <MobileBar />;
  }

  return (
    <>
      {/* Sentinel: observed to detect when the bar becomes sticky */}
      <div style={{ height: 0 }} />
      <PillBarOuter ref={outerRef}>
        <PillBar>
          {BOTTOM_BAR_ITEMS.map(({ label, anchorId, icon: Icon }, index) => (
            <Fragment key={anchorId}>
              {index > 0 && <BottomBarDivider />}
              <BottomBarLink
                type="button"
                onClick={() => {
                  scrollToSection(anchorId);
                  trackEvent({ category: 'Homepage', action: `Hero Bottom Bar / ${label}` });
                }}
              >
                <Icon fontSize="small" color="primary" />
                <Typography variant="body2" fontWeight={500} noWrap>
                  {label}
                </Typography>
              </BottomBarLink>
            </Fragment>
          ))}
        </PillBar>
      </PillBarOuter>
    </>
  );
}
