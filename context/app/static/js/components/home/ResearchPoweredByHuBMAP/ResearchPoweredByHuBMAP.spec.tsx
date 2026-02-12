import React from 'react';
import { render, screen, appProviderEndpoints } from 'test-utils/functions';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import ResearchPoweredByHuBMAP from './ResearchPoweredByHuBMAP';
import { parsePinnedUUIDs } from './hooks';

const mockPublications = Array.from({ length: 10 }, (_, i) => ({
  uuid: `uuid-${i}`,
  title: `Publication Title ${i}`,
  contributors: [
    {
      first_name: 'John',
      last_name: 'Doe',
      name: 'John Doe',
      orcid_id: '',
      version: '0' as const,
      affiliation: 'Test University',
      middle_name_or_initial: '',
    },
  ],
  publication_venue: `Journal ${i}`,
  publication_date: '2024-01-01',
  publication_status: true,
}));

const server = setupServer(
  http.post(`/${appProviderEndpoints.elasticsearchEndpoint}`, () => {
    return HttpResponse.json({
      hits: {
        total: { value: mockPublications.length, relation: 'eq' },
        hits: mockPublications.map((pub) => ({ _source: pub })),
      },
    });
  }),
);

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

describe('ResearchPoweredByHuBMAP', () => {
  test('renders 6 publication cards', async () => {
    render(<ResearchPoweredByHuBMAP />);
    const links = await screen.findAllByText(/View Publication/);
    expect(links).toHaveLength(6);
  });

  test('renders introductory text', async () => {
    render(<ResearchPoweredByHuBMAP />);
    await screen.findAllByText(/View Publication/);
    expect(screen.getByText(/Trusted by top institutions/)).toBeInTheDocument();
    expect(screen.getByText(/HuBMAP data powers high-impact discoveries/)).toBeInTheDocument();
  });

  test('renders "View All Publications" button linking to /publications', async () => {
    render(<ResearchPoweredByHuBMAP />);
    const button = await screen.findByRole('link', { name: /View All Publications/ });
    expect(button).toHaveAttribute('href', '/publications');
  });

  test('shows pin icon for pinned publications', async () => {
    render(<ResearchPoweredByHuBMAP />, {
      flaskData: { pinnedPublicationUUIDs: 'uuid-0' },
    });
    const pins = await screen.findAllByTestId('PushPinRoundedIcon');
    expect(pins).toHaveLength(1);
  });

  test('shows no pin icons when no publications are pinned', async () => {
    render(<ResearchPoweredByHuBMAP />);
    await screen.findAllByText(/View Publication/);
    expect(screen.queryAllByTestId('PushPinRoundedIcon')).toHaveLength(0);
  });

  test('renders publication titles and attribution', async () => {
    render(<ResearchPoweredByHuBMAP />);
    // Wait for publications to load
    const titles = await screen.findAllByText(/Publication Title/);
    expect(titles.length).toBeGreaterThan(0);
    // Attribution uses buildSecondaryText which produces "Name | Venue"
    expect(screen.getAllByText(/John Doe/).length).toBeGreaterThan(0);
  });
});

describe('parsePinnedUUIDs', () => {
  test('returns empty array for empty string', () => {
    expect(parsePinnedUUIDs('')).toEqual([]);
  });

  test('returns empty array for undefined', () => {
    expect(parsePinnedUUIDs(undefined)).toEqual([]);
  });

  test('returns empty array for non-string values', () => {
    expect(parsePinnedUUIDs(42)).toEqual([]);
    expect(parsePinnedUUIDs(null)).toEqual([]);
  });

  test('parses comma-separated UUIDs', () => {
    expect(parsePinnedUUIDs('uuid1,uuid2,uuid3')).toEqual(['uuid1', 'uuid2', 'uuid3']);
  });

  test('trims whitespace from UUIDs', () => {
    expect(parsePinnedUUIDs(' uuid1 , uuid2 ')).toEqual(['uuid1', 'uuid2']);
  });

  test('filters out empty strings from trailing commas', () => {
    expect(parsePinnedUUIDs('uuid1,,uuid2,')).toEqual(['uuid1', 'uuid2']);
  });
});
