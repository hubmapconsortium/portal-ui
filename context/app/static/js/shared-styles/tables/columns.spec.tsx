import React from 'react';
import { render } from '@testing-library/react';
import { donorAge, donorBMI, donorSex, donorRace } from './columns';
import { DonorDocument } from 'js/typings/search';

describe('Donor Column Cell Content Functions', () => {
  describe('DonorAge', () => {
    it('renders age value with unit when present', () => {
      const mockHit: Partial<DonorDocument> = {
        mapped_metadata: {
          age_value: 45,
          age_unit: 'years',
          body_mass_index_unit: 'kg/m²',
          body_mass_index_value: 25.5,
          sex: 'Male',
          race: 'Asian',
        },
      };

      const { cellContent: DonorAgeCell } = donorAge;
      const { container } = render(<DonorAgeCell hit={mockHit as DonorDocument} />);

      expect(container).toHaveTextContent('45 years');
    });

    it('renders nothing when mapped_metadata is missing', () => {
      const mockHit: Partial<DonorDocument> = {};

      const { cellContent: DonorAgeCell } = donorAge;
      const { container } = render(<DonorAgeCell hit={mockHit as DonorDocument} />);

      expect(container).toHaveTextContent('');
    });

    it('renders nothing when age_value is undefined', () => {
      const mockHit: Partial<DonorDocument> = {
        mapped_metadata: {
          age_value: undefined as unknown as number,
          age_unit: 'years',
          body_mass_index_unit: 'kg/m²',
          body_mass_index_value: 25.5,
          sex: 'Male',
          race: 'Asian',
        },
      };

      const { cellContent: DonorAgeCell } = donorAge;
      const { container } = render(<DonorAgeCell hit={mockHit as DonorDocument} />);

      expect(container).toHaveTextContent('');
    });
  });

  describe('DonorBMI', () => {
    it('renders BMI value when present', () => {
      const mockHit: Partial<DonorDocument> = {
        mapped_metadata: {
          age_value: 45,
          age_unit: 'years',
          body_mass_index_unit: 'kg/m²',
          body_mass_index_value: 28.3,
          sex: 'Female',
          race: 'White',
        },
      };

      const { cellContent: DonorBMICell } = donorBMI;
      const { container } = render(<DonorBMICell hit={mockHit as DonorDocument} />);

      expect(container).toHaveTextContent('28.3');
    });

    it('renders nothing when mapped_metadata is missing', () => {
      const mockHit: Partial<DonorDocument> = {};

      const { cellContent: DonorBMICell } = donorBMI;
      const { container } = render(<DonorBMICell hit={mockHit as DonorDocument} />);

      expect(container).toHaveTextContent('');
    });

    it('renders nothing when body_mass_index_value is undefined', () => {
      const mockHit: Partial<DonorDocument> = {
        mapped_metadata: {
          age_value: 45,
          age_unit: 'years',
          body_mass_index_unit: 'kg/m²',
          body_mass_index_value: undefined as unknown as number,
          sex: 'Male',
          race: 'Asian',
        },
      };

      const { cellContent: DonorBMICell } = donorBMI;
      const { container } = render(<DonorBMICell hit={mockHit as DonorDocument} />);

      expect(container).toHaveTextContent('');
    });

    it('renders zero BMI correctly', () => {
      const mockHit: Partial<DonorDocument> = {
        mapped_metadata: {
          age_value: 45,
          age_unit: 'years',
          body_mass_index_unit: 'kg/m²',
          body_mass_index_value: 0,
          sex: 'Male',
          race: 'Asian',
        },
      };

      const { cellContent: DonorBMICell } = donorBMI;
      const { container } = render(<DonorBMICell hit={mockHit as DonorDocument} />);

      expect(container).toHaveTextContent('0');
    });
  });

  describe('DonorSex', () => {
    it('renders sex when present', () => {
      const mockHit: Partial<DonorDocument> = {
        mapped_metadata: {
          age_value: 55,
          age_unit: 'years',
          body_mass_index_unit: 'kg/m²',
          body_mass_index_value: 22.1,
          sex: 'Female',
          race: 'Black or African American',
        },
      };

      const { cellContent: DonorSexCell } = donorSex;
      const { container } = render(<DonorSexCell hit={mockHit as DonorDocument} />);

      expect(container).toHaveTextContent('Female');
    });

    it('renders nothing when mapped_metadata is missing', () => {
      const mockHit: Partial<DonorDocument> = {};

      const { cellContent: DonorSexCell } = donorSex;
      const { container } = render(<DonorSexCell hit={mockHit as DonorDocument} />);

      expect(container).toHaveTextContent('');
    });

    it('renders nothing when sex is undefined', () => {
      const mockHit: Partial<DonorDocument> = {
        mapped_metadata: {
          age_value: 45,
          age_unit: 'years',
          body_mass_index_unit: 'kg/m²',
          body_mass_index_value: 25.5,
          sex: undefined as unknown as string,
          race: 'Asian',
        },
      };

      const { cellContent: DonorSexCell } = donorSex;
      const { container } = render(<DonorSexCell hit={mockHit as DonorDocument} />);

      expect(container).toHaveTextContent('');
    });
  });

  describe('DonorRace', () => {
    it('renders race when present', () => {
      const mockHit: Partial<DonorDocument> = {
        mapped_metadata: {
          age_value: 60,
          age_unit: 'years',
          body_mass_index_unit: 'kg/m²',
          body_mass_index_value: 26.8,
          sex: 'Male',
          race: 'Hispanic or Latino',
        },
      };

      const { cellContent: DonorRaceCell } = donorRace;
      const { container } = render(<DonorRaceCell hit={mockHit as DonorDocument} />);

      expect(container).toHaveTextContent('Hispanic or Latino');
    });

    it('renders nothing when mapped_metadata is missing', () => {
      const mockHit: Partial<DonorDocument> = {};

      const { cellContent: DonorRaceCell } = donorRace;
      const { container } = render(<DonorRaceCell hit={mockHit as DonorDocument} />);

      expect(container).toHaveTextContent('');
    });

    it('renders nothing when race is undefined', () => {
      const mockHit: Partial<DonorDocument> = {
        mapped_metadata: {
          age_value: 45,
          age_unit: 'years',
          body_mass_index_unit: 'kg/m²',
          body_mass_index_value: 25.5,
          sex: 'Male',
          race: undefined as unknown as string,
        },
      };

      const { cellContent: DonorRaceCell } = donorRace;
      const { container } = render(<DonorRaceCell hit={mockHit as DonorDocument} />);

      expect(container).toHaveTextContent('');
    });
  });

  describe('Column Configuration', () => {
    it('donorAge has correct configuration', () => {
      expect(donorAge).toMatchObject({
        id: 'mapped_metadata.age_value',
        label: 'Donor Age',
        sort: 'mapped_metadata.age_value',
        width: 150,
        filterable: true,
      });
      expect(donorAge.cellContent).toBeDefined();
    });

    it('donorBMI has correct configuration', () => {
      expect(donorBMI).toMatchObject({
        id: 'mapped_metadata.body_mass_index_value',
        label: 'Donor BMI',
        sort: 'mapped_metadata.body_mass_index_value',
        width: 150,
        filterable: true,
      });
      expect(donorBMI.cellContent).toBeDefined();
    });

    it('donorSex has correct configuration', () => {
      expect(donorSex).toMatchObject({
        id: 'mapped_metadata.sex',
        label: 'Donor Sex',
        sort: 'mapped_metadata.sex.keyword',
        width: 150,
        filterable: true,
      });
      expect(donorSex.cellContent).toBeDefined();
    });

    it('donorRace has correct configuration', () => {
      expect(donorRace).toMatchObject({
        id: 'mapped_metadata.race',
        label: 'Donor Race',
        sort: 'mapped_metadata.race.keyword',
        width: 150,
        filterable: true,
      });
      expect(donorRace.cellContent).toBeDefined();
    });
  });
});
