import React from 'react';
import { type MockedFunction } from 'vitest';
import { act, render, screen, waitFor } from 'test-utils/functions';
import userEvent from '@testing-library/user-event';
import { NuqsTestingAdapter, type OnUrlUpdateFunction } from 'nuqs/adapters/testing';

import MolecularDataQueryForm from './MolecularDataQueryForm';
import MolecularDataQueryFormTrackingProvider from './MolecularDataQueryFormTrackingProvider';
import QueryType from './QueryType';
import QueryParametersFieldset from './QueryParameters';
import { MolecularDataQueryFormProps } from './types';

// The pathway and gene-name lookups hit UBKG, whose endpoint is not configured in tests.
vi.mock('js/hooks/useUBKG', async (importOriginal) => ({
  ...(await importOriginal<typeof import('js/hooks/useUBKG')>()),
  useGenePathways: () => ({ data: { events: [] }, isLoading: false }),
  useGeneOntologyDetail: () => ({ data: undefined }),
}));

function renderForm({
  searchParams = '',
  onUrlUpdate,
  initialValues,
}: {
  searchParams?: string;
  onUrlUpdate?: OnUrlUpdateFunction;
  initialValues?: MolecularDataQueryFormProps['initialValues'];
} = {}) {
  return render(
    <NuqsTestingAdapter searchParams={searchParams} onUrlUpdate={onUrlUpdate} hasMemory>
      <MolecularDataQueryFormTrackingProvider>
        <MolecularDataQueryForm initialValues={initialValues}>
          <QueryType />
          <QueryParametersFieldset />
        </MolecularDataQueryForm>
      </MolecularDataQueryFormTrackingProvider>
    </NuqsTestingAdapter>,
  );
}

const umod = { full: 'UMOD', pre: '', match: 'UMOD', post: '' };

describe('MolecularDataQueryForm URL state', () => {
  it('writes the query to the URL when the user runs it', async () => {
    const user = userEvent.setup();
    const onUrlUpdate: MockedFunction<OnUrlUpdateFunction> = vi.fn();
    renderForm({ onUrlUpdate, initialValues: { queryType: 'gene', queryMethod: 'scFindATAC', genes: [umod] } });

    await user.click(screen.getByRole('button', { name: /Run Query/i }));

    await waitFor(() => expect(onUrlUpdate).toHaveBeenCalled());
    const { searchParams } = onUrlUpdate.mock.calls.at(-1)![0];
    expect(searchParams.get('genes')).toBe('UMOD');
    expect(searchParams.get('modality')).toBe('ATAC');
    expect(searchParams.get('cell_types')).toBeNull();
  });

  it('round-trips cell type labels containing commas', async () => {
    const user = userEvent.setup();
    const onUrlUpdate: MockedFunction<OnUrlUpdateFunction> = vi.fn();
    const label = 'Lung.B cell, CD19-positive';
    renderForm({
      onUrlUpdate,
      initialValues: {
        queryType: 'cell-type',
        queryMethod: 'scFind',
        cellTypes: [{ full: label, pre: '', match: label, post: '' }, umod],
      },
    });

    await user.click(screen.getByRole('button', { name: /Run Query/i }));

    await waitFor(() => expect(onUrlUpdate).toHaveBeenCalled());
    const { searchParams } = onUrlUpdate.mock.calls.at(-1)![0];
    // Comma-joined lists would split this label in half; the `|` separator keeps it intact.
    expect(searchParams.get('cell_types')).toBe(`${label}|UMOD`);
    expect(searchParams.get('genes')).toBeNull();
  });

  it('does not touch the URL until the query is run', () => {
    const onUrlUpdate: MockedFunction<OnUrlUpdateFunction> = vi.fn();
    renderForm({ onUrlUpdate, initialValues: { queryType: 'gene', queryMethod: 'scFind', genes: [umod] } });

    expect(onUrlUpdate).not.toHaveBeenCalled();
  });

  it('runs a query restored from the URL without pushing it back onto history', async () => {
    const onUrlUpdate: MockedFunction<OnUrlUpdateFunction> = vi.fn();
    renderForm({ searchParams: '?genes=UMOD|ACTB', onUrlUpdate });

    // Reaching the results step is what surfaces the "Edit Parameters" control.
    expect(await screen.findByRole('button', { name: /Edit Parameters/i })).toBeInTheDocument();
    expect(onUrlUpdate).not.toHaveBeenCalled();
  });

  it('stays on the parameters step when the URL has no query', () => {
    renderForm();
    expect(screen.queryByRole('button', { name: /Edit Parameters/i })).not.toBeInTheDocument();
  });
});

/** Drives the browser's back/forward buttons: change the URL, then fire the event they fire. */
function navigateTo(search: string) {
  act(() => {
    window.history.pushState({}, '', `${PATH}${search}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
}

const PATH = '/search/biomarkers-cell-types';

describe('MolecularDataQueryForm history navigation', () => {
  beforeEach(() => {
    window.history.pushState({}, '', PATH);
  });

  it('going back from a query returns to the parameters view', async () => {
    navigateTo('?genes=UMOD');
    renderForm({ searchParams: '?genes=UMOD' });
    expect(await screen.findByRole('button', { name: /Edit Parameters/i })).toBeInTheDocument();

    navigateTo('');

    await waitFor(() => expect(screen.queryByRole('button', { name: /Edit Parameters/i })).not.toBeInTheDocument());
    expect(screen.getByRole('button', { name: /Run Query/i })).toBeDisabled();
  });

  it('going forward to a query proceeds to the results view', async () => {
    renderForm();
    expect(screen.queryByRole('button', { name: /Edit Parameters/i })).not.toBeInTheDocument();

    navigateTo('?genes=UMOD');

    expect(await screen.findByRole('button', { name: /Edit Parameters/i })).toBeInTheDocument();
  });

  it('restores the parameters of the query it navigated to', async () => {
    renderForm();

    navigateTo('?cell_types=Lung.B%20cell%2C%20CD19-positive&modality=ATAC');

    expect(await screen.findByRole('button', { name: /Edit Parameters/i })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Edit Parameters/i }));

    expect(screen.getByRole('combobox', { name: /Query Type/i })).toHaveTextContent('Cell Type');
    expect(screen.getByRole('combobox', { name: /Query Method/i })).toHaveTextContent('ATACseq (DNA accessibility)');
    expect(screen.getByRole('button', { name: /Lung.B cell, CD19-positive/i })).toBeInTheDocument();
  });

  it('does not write to the URL while navigating history', async () => {
    const onUrlUpdate: MockedFunction<OnUrlUpdateFunction> = vi.fn();
    renderForm({ onUrlUpdate });

    navigateTo('?genes=UMOD');
    expect(await screen.findByRole('button', { name: /Edit Parameters/i })).toBeInTheDocument();

    navigateTo('');
    await waitFor(() => expect(screen.queryByRole('button', { name: /Edit Parameters/i })).not.toBeInTheDocument());

    expect(onUrlUpdate).not.toHaveBeenCalled();
  });
});
