import { formValuesToParams, paramsToInitialValues, QueryParams } from './urlState';
import { MolecularDataQueryFormState } from './types';

const emptyParams: QueryParams = { genes: null, cell_types: null, modality: null, pathway: null };

/** The names of whichever entity list the snapshot populated; only ever one of the two. */
function names(values: Partial<MolecularDataQueryFormState>) {
  const entities = ('genes' in values ? values.genes : undefined) ?? ('cellTypes' in values ? values.cellTypes : []);
  return (entities ?? []).map((entity) => entity.full);
}

describe('paramsToInitialValues', () => {
  it('reports no query for an empty URL', () => {
    const { initialValues, hasQuery, pathwayCode } = paramsToInitialValues(emptyParams);
    expect(hasQuery).toBe(false);
    expect(initialValues).toEqual({});
    expect(pathwayCode).toBeNull();
  });

  it('builds a gene query, defaulting to the RNA method', () => {
    const { initialValues, hasQuery } = paramsToInitialValues({ ...emptyParams, genes: ['UMOD', 'ACTB'] });
    expect(hasQuery).toBe(true);
    expect(initialValues.queryType).toBe('gene');
    expect(initialValues.queryMethod).toBe('scFind');
    expect(names(initialValues)).toEqual(['UMOD', 'ACTB']);
  });

  it('reads the ATAC modality as the scFindATAC method', () => {
    const { initialValues } = paramsToInitialValues({ ...emptyParams, genes: ['UMOD'], modality: 'ATAC' });
    expect(initialValues.queryMethod).toBe('scFindATAC');
  });

  it('builds a cell type query, preserving commas in labels', () => {
    const { initialValues, hasQuery } = paramsToInitialValues({
      ...emptyParams,
      cell_types: ['Kidney.epithelial cell of proximal tubule', 'Lung.B cell, CD19-positive'],
    });
    expect(hasQuery).toBe(true);
    expect(initialValues.queryType).toBe('cell-type');
    expect(names(initialValues)).toEqual(['Kidney.epithelial cell of proximal tubule', 'Lung.B cell, CD19-positive']);
  });

  it('carries the pathway code through for gene queries only', () => {
    expect(paramsToInitialValues({ ...emptyParams, genes: ['UMOD'], pathway: 'R-HSA-73894' }).pathwayCode).toBe(
      'R-HSA-73894',
    );
    expect(
      paramsToInitialValues({ ...emptyParams, cell_types: ['T cell'], pathway: 'R-HSA-73894' }).pathwayCode,
    ).toBeNull();
  });

  it('treats a hand-edited URL carrying both lists as a gene query', () => {
    const { initialValues } = paramsToInitialValues({ ...emptyParams, genes: ['UMOD'], cell_types: ['T cell'] });
    expect(initialValues.queryType).toBe('gene');
    expect(names(initialValues)).toEqual(['UMOD']);
  });

  it('ignores empty entries left by a mangled URL', () => {
    expect(paramsToInitialValues({ ...emptyParams, genes: [''] }).hasQuery).toBe(false);
  });
});

describe('formValuesToParams', () => {
  const gene = (full: string) => ({ full, pre: '', match: full, post: '' });

  it('serializes a gene query, dropping the default modality', () => {
    const data = {
      queryType: 'gene',
      queryMethod: 'scFind',
      genes: [gene('UMOD'), gene('ACTB')],
      pathway: null,
    } as unknown as MolecularDataQueryFormState;
    expect(formValuesToParams(data)).toEqual({
      genes: ['UMOD', 'ACTB'],
      cell_types: null,
      modality: null,
      pathway: null,
    });
  });

  it('serializes the ATAC modality and a selected pathway', () => {
    const data = {
      queryType: 'gene',
      queryMethod: 'scFindATAC',
      genes: [gene('UMOD')],
      pathway: { ...gene('DNA Damage Response (R-HSA-73894)'), values: ['R-HSA-73894'] },
    } as unknown as MolecularDataQueryFormState;
    expect(formValuesToParams(data)).toMatchObject({ modality: 'ATAC', pathway: 'R-HSA-73894' });
  });

  it('serializes a cell type query', () => {
    const data = {
      queryType: 'cell-type',
      queryMethod: 'scFind',
      cellTypes: [gene('Kidney.T cell')],
    } as unknown as MolecularDataQueryFormState;
    expect(formValuesToParams(data)).toEqual({
      genes: null,
      cell_types: ['Kidney.T cell'],
      modality: null,
      pathway: null,
    });
  });
});

describe('round trip', () => {
  it('restores the same gene names and method', () => {
    const data = {
      queryType: 'gene',
      queryMethod: 'scFindATAC',
      genes: [{ full: 'UMOD', pre: '', match: 'UMOD', post: '' }],
      pathway: null,
    } as unknown as MolecularDataQueryFormState;

    const { initialValues } = paramsToInitialValues(formValuesToParams(data));
    expect(names(initialValues)).toEqual(['UMOD']);
    expect(initialValues.queryMethod).toBe('scFindATAC');
  });
});
