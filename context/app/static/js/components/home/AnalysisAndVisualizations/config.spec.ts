import { VISUALIZE_DATA_SLIDE } from './config';
import { DATASET_FEATURES_FIELD, parseReadableParams } from 'js/components/search/searchParams';

describe('VISUALIZE_DATA_SLIDE', () => {
  // Regression: this href used to be a hand-authored compressed `q` blob whose filter values were
  // a `Set("…")` string rather than an array. That failed zod validation, so parseURLState threw and
  // silently discarded the whole URL state, landing the CTA on an unfiltered dataset search page.
  test('the View Visualizations CTA links to datasets filtered to visualization available', () => {
    const { href } = VISUALIZE_DATA_SLIDE.views[0].ctaButton;

    expect(href).toBe('/search/datasets?visualization=true');
    expect(parseReadableParams(href.slice(href.indexOf('?'))).filters?.[DATASET_FEATURES_FIELD]).toEqual({
      type: 'BOOLEAN_GROUP',
      values: ['visualization::true'],
    });
  });
});
