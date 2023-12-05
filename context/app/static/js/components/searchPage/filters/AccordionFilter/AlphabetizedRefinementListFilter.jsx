import { RefinementListFilter } from 'searchkit';

/**
 * A modified version of the RefinementListFilter that sorts the items alphabetically.
 * Since ES aggregations are sorted case sensitively, using this override allows us to
 * display the items sorted in a case insensitive manner.
 */
export default class AlphabetizedRefinementListFilter extends RefinementListFilter {
  /**
   *
   * @returns {Array} The items sorted alphabetically
   */
  getItems() {
    return super.getItems().sort((a, b) => {
      return a.key.localeCompare(b.key);
    });
  }
}
