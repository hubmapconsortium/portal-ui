import React, { useState, useEffect, useReducer, useRef } from 'react';
import { Vitessce } from 'vitessce';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

import VisualizationThemeSwitch from '../VisualizationThemeSwitch';
import {
  vitessceFixedHeight,
  bodyExpandedCSS,
  StyledSectionContainer,
  StyledHeader,
  StyledHeaderText,
  StyledHeaderRight,
  StyledHeaderLeft,
  ExpandButton,
  TopSnackbar,
  ExpandableDiv,
  StyledFooterText,
  SelectionButton,
} from './style';
import 'vitessce/dist/es/production/static/css/index.css';

// const vitData1 = {
//   layers: [
//     {
//       name: 'cells',
//       type: 'CELLS',
//       url:
//         'https://assets.test.hubmapconsortium.org/c4eeeb906ce756650245f04c2ad12754/cluster-marker-genes/output/cluster_marker_genes.cells.json?token=Agkjr0pwew57l40am2J06Evg9Knw8onDjBywMx8kKXOQ1VxzzYFOCO8qGmeO9pjQkPdMX0qnqzPrBjfjdjBWNtvzkX',
//     },
//     {
//       name: 'cell-sets',
//       type: 'CELL-SETS',
//       url:
//         'https://assets.test.hubmapconsortium.org/c4eeeb906ce756650245f04c2ad12754/cluster-marker-genes/output/cluster_marker_genes.cell-sets.json?token=Agkjr0pwew57l40am2J06Evg9Knw8onDjBywMx8kKXOQ1VxzzYFOCO8qGmeO9pjQkPdMX0qnqzPrBjfjdjBWNtvzkX',
//     },
//   ],
//   name: 'c4eeeb906ce756650245f04c2ad12754',
//   staticLayout: [
//     {
//       component: 'scatterplot',
//       h: 6,
//       props: {
//         mapping: 'UMAP',
//         view: {
//           target: [0, 0, 0],
//           zoom: 4,
//         },
//       },
//       w: 9,
//       x: 0,
//       y: 0,
//     },
//     {
//       component: 'cellSets',
//       h: 6,
//       w: 3,
//       x: 9,
//       y: 0,
//     },
//   ],
// };

// const vitData2 = {
//   layers: [
//     {
//       name: 'cells',
//       type: 'CELLS',
//       url:
//         'https://assets.test.hubmapconsortium.org/196f0d0603f8a7a41646e42b0093c56b/cluster-marker-genes/output/cluster_marker_genes.cells.json?token=Agkjr0pwew57l40am2J06Evg9Knw8onDjBywMx8kKXOQ1VxzzYFOCO8qGmeO9pjQkPdMX0qnqzPrBjfjdjBWNtvzkX',
//     },
//     {
//       name: 'cell-sets',
//       type: 'CELL-SETS',
//       url:
//         'https://assets.test.hubmapconsortium.org/196f0d0603f8a7a41646e42b0093c56b/cluster-marker-genes/output/cluster_marker_genes.cell-sets.json?token=Agkjr0pwew57l40am2J06Evg9Knw8onDjBywMx8kKXOQ1VxzzYFOCO8qGmeO9pjQkPdMX0qnqzPrBjfjdjBWNtvzkX',
//     },
//   ],
//   name: '196f0d0603f8a7a41646e42b0093c56b',
//   staticLayout: [
//     {
//       component: 'scatterplot',
//       h: 6,
//       props: {
//         mapping: 'UMAP',
//         view: {
//           target: [0, 0, 0],
//           zoom: 4,
//         },
//       },
//       w: 9,
//       x: 0,
//       y: 0,
//     },
//     {
//       component: 'cellSets',
//       h: 6,
//       w: 3,
//       x: 9,
//       y: 0,
//     },
//   ],
// };

function Visualization(props) {
  const { vitData } = props;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [vitessceTheme, setVitessceTheme] = useState('light');
  const [vitessceSelection, setVitessceSelection] = useState(0);
  const [open, toggle] = useReducer((v) => !v, false);
  const anchorRef = useRef(null);

  function handleExpand() {
    setIsExpanded(true);
    setIsSnackbarOpen(true);
  }

  function handleCollapse() {
    setIsExpanded(false);
    setIsSnackbarOpen(false);
  }

  function handleThemeChange(e) {
    if (e.target.checked) {
      setVitessceTheme('dark');
    } else {
      setVitessceTheme('light');
    }
  }

  useEffect(() => {
    function onKeydown(event) {
      if (event.key === 'Escape') {
        handleCollapse();
      }
    }
    window.addEventListener('keydown', onKeydown);
    return () => {
      window.removeEventListener('keydown', onKeydown);
    };
  }, []);
  return (
    <StyledSectionContainer id="visualization">
      <StyledHeader>
        <StyledHeaderLeft>
          <StyledHeaderText variant="h3" component="h2">
            Visualization
          </StyledHeaderText>
          {Array.isArray(vitData) ? (
            <>
              <SelectionButton ref={anchorRef} onClick={toggle}>
                Selection {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
              </SelectionButton>
              <Popper open={open} anchorEl={anchorRef.current} placement="top-end" style={{ zIndex: 50 }}>
                <Paper style={{ maxHeight: 200, overflow: 'auto' }}>
                  <ClickAwayListener onClickAway={toggle}>
                    <MenuList id="showcase-options">
                      {vitData.map(({ name }, i) => (
                        <MenuItem onClick={() => setVitessceSelection(i)} key={name}>
                          {name}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Popper>
            </>
          ) : null}
        </StyledHeaderLeft>
        <StyledHeaderRight>
          <VisualizationThemeSwitch theme={vitessceTheme} onChange={handleThemeChange} />
          <ExpandButton onClick={handleExpand}>
            <ZoomOutMapIcon />
          </ExpandButton>
        </StyledHeaderRight>
      </StyledHeader>
      <Paper>
        <ExpandableDiv $isExpanded={isExpanded} $theme={vitessceTheme}>
          <TopSnackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            open={isSnackbarOpen}
            autoHideDuration={4000}
            onClose={() => setIsSnackbarOpen(false)}
            message="Press [esc] to exit full window."
          />
          <Vitessce
            config={vitData[vitessceSelection] || vitData}
            theme={vitessceTheme}
            height={isExpanded ? null : vitessceFixedHeight}
          />
        </ExpandableDiv>
      </Paper>
      <StyledFooterText variant="body2">
        Powered by&nbsp;
        <Link href="http://vitessce.io" target="_blank" rel="noreferrer">
          Vitessce
        </Link>
      </StyledFooterText>
      <style type="text/css">{isExpanded ? bodyExpandedCSS : null}</style>
    </StyledSectionContainer>
  );
}

export default Visualization;
