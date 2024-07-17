import SvgIcon from '@mui/material/SvgIcon';
import { capitalizeAndReplaceDashes } from 'js/helpers/functions';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';

type Section = [string, { text: string; hash: string; icon?: typeof SvgIcon }];

function getSectionFromString(s: string): Section {
  return [s, { text: capitalizeAndReplaceDashes(s), hash: s, icon: sectionIconMap?.[s] }];
}

function getSections(sectionOrder: string[]) {
  // Array order reflects order of table of contents.
  return sectionOrder.map((s) => getSectionFromString(s));
}

export { getSections };
