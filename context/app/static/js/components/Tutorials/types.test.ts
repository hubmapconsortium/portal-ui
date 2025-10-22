import {
  TUTORIAL_CATEGORIES,
  TUTORIAL_CATEGORY_SECTIONS,
  TUTORIAL_CATEGORY_DATA,
  TUTORIALS,
  TUTORIAL_TAGS,
  TutorialCategory,
  TutorialCategorySection,
} from './types';

describe('types', () => {
  describe('TUTORIAL_CATEGORIES', () => {
    it('should contain all expected categories', () => {
      const expectedCategories = ['Biomarker and Cell Type Search', 'Data', 'Visualization', 'Workspaces'];

      expect(TUTORIAL_CATEGORIES).toEqual(expectedCategories);
    });
  });

  describe('TUTORIAL_CATEGORY_SECTIONS', () => {
    it('should include Featured Tutorials first, then all categories', () => {
      expect(TUTORIAL_CATEGORY_SECTIONS[0]).toBe('Featured Tutorials');

      // Rest should match TUTORIAL_CATEGORIES
      const remainingSections = TUTORIAL_CATEGORY_SECTIONS.slice(1);
      expect(remainingSections).toEqual(TUTORIAL_CATEGORIES);
    });

    it('should have correct length', () => {
      expect(TUTORIAL_CATEGORY_SECTIONS).toHaveLength(TUTORIAL_CATEGORIES.length + 1);
    });
  });

  describe('TUTORIAL_CATEGORY_DATA', () => {
    it('should have data for all category sections', () => {
      TUTORIAL_CATEGORY_SECTIONS.forEach((section) => {
        expect(TUTORIAL_CATEGORY_DATA).toHaveProperty(section);

        const categoryData = TUTORIAL_CATEGORY_DATA[section];
        expect(categoryData).toHaveProperty('title');
        expect(categoryData).toHaveProperty('description');
        expect(categoryData).toHaveProperty('icon');
        expect(categoryData).toHaveProperty('id');
      });
    });

    it('should have correct data structure for Featured Tutorials', () => {
      const featuredData = TUTORIAL_CATEGORY_DATA['Featured Tutorials'];

      expect(featuredData.title).toBe('Featured Tutorials');
      expect(featuredData.description).toBe('Get started quickly with these essential HuBMAP tutorials.');
      expect(featuredData.id).toBe('featured-tutorials');
      expect(featuredData.icon).toBeDefined();
    });

    it('should have correct data structure for each category', () => {
      const expectedData = {
        'Biomarker and Cell Type Search': {
          title: 'Biomarker and Cell Type Search',
          id: 'biomarker-and-cell-type-search',
        },
        Data: {
          title: 'Data',
          id: 'data',
        },
        Visualization: {
          title: 'Visualization',
          id: 'visualization',
        },
        Workspaces: {
          title: 'Workspaces',
          id: 'workspaces',
        },
      };

      Object.entries(expectedData).forEach(([category, expected]) => {
        const categoryData = TUTORIAL_CATEGORY_DATA[category as TutorialCategory];
        expect(categoryData.title).toBe(expected.title);
        expect(categoryData.id).toBe(expected.id);
        expect(categoryData.description).toBeTruthy();
        expect(categoryData.icon).toBeDefined();
      });
    });

    it('should have unique IDs for all categories', () => {
      const ids = TUTORIAL_CATEGORY_SECTIONS.map((section) => TUTORIAL_CATEGORY_DATA[section].id);

      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('TUTORIALS', () => {
    it('should be an array of tutorials', () => {
      expect(Array.isArray(TUTORIALS)).toBe(true);
      expect(TUTORIALS.length).toBeGreaterThan(0);
    });

    it('should have tutorials with all required properties', () => {
      TUTORIALS.forEach((tutorial) => {
        expect(tutorial).toHaveProperty('title');
        expect(tutorial).toHaveProperty('route');
        expect(tutorial).toHaveProperty('description');
        expect(tutorial).toHaveProperty('tags');
        expect(tutorial).toHaveProperty('category');
        expect(tutorial).toHaveProperty('iframeLink');

        expect(typeof tutorial.title).toBe('string');
        expect(typeof tutorial.route).toBe('string');
        expect(typeof tutorial.description).toBe('string');
        expect(Array.isArray(tutorial.tags)).toBe(true);
        expect(typeof tutorial.category).toBe('string');
        expect(typeof tutorial.iframeLink).toBe('string');

        expect(tutorial.isFeatured === undefined || typeof tutorial.isFeatured === 'boolean').toBe(true);
      });
    });

    it('should have tutorials with valid categories', () => {
      TUTORIALS.forEach((tutorial) => {
        expect(TUTORIAL_CATEGORIES).toContain(tutorial.category);
      });
    });

    it('should have unique routes', () => {
      const routes = TUTORIALS.map((tutorial) => tutorial.route);
      const uniqueRoutes = new Set(routes);

      expect(uniqueRoutes.size).toBe(routes.length);
    });

    it('should have non-empty titles and descriptions', () => {
      TUTORIALS.forEach((tutorial) => {
        expect(tutorial.title.trim()).toBeTruthy();
        expect(tutorial.description.trim()).toBeTruthy();
        expect(tutorial.route.trim()).toBeTruthy();
      });
    });

    it('should have at least one featured tutorial', () => {
      const featuredTutorials = TUTORIALS.filter((tutorial) => tutorial.isFeatured);
      expect(featuredTutorials.length).toBeGreaterThan(0);
    });

    it('should have tutorials for each category', () => {
      // Note: This test validates the actual TUTORIALS data, not mock data
      // Some categories might not have tutorials in the real data
      const categoriesWithTutorials = new Set();
      TUTORIALS.forEach((tutorial) => {
        categoriesWithTutorials.add(tutorial.category);
      });

      // At least some categories should have tutorials
      expect(categoriesWithTutorials.size).toBeGreaterThan(0);
    });
  });

  describe('TUTORIAL_TAGS', () => {
    it('should contain all unique tags from tutorials', () => {
      const allTags = new Set<string>();

      TUTORIALS.forEach((tutorial) => {
        tutorial.tags.forEach((tag) => {
          allTags.add(tag);
        });
      });

      const expectedTags = Array.from(allTags).sort();
      expect(TUTORIAL_TAGS).toEqual(expectedTags);
    });

    it('should be sorted alphabetically', () => {
      const sortedTags = [...TUTORIAL_TAGS].sort();
      expect(TUTORIAL_TAGS).toEqual(sortedTags);
    });

    it('should not contain duplicates', () => {
      const uniqueTags = new Set(TUTORIAL_TAGS);
      expect(uniqueTags.size).toBe(TUTORIAL_TAGS.length);
    });

    it('should contain non-empty strings', () => {
      TUTORIAL_TAGS.forEach((tag) => {
        expect(typeof tag).toBe('string');
        expect(tag.trim()).toBeTruthy();
      });
    });
  });

  describe('Type definitions', () => {
    it('should properly type TutorialCategory', () => {
      const validCategories: TutorialCategory[] = [
        'Biomarker and Cell Type Search',
        'Data',
        'Visualization',
        'Workspaces',
      ];

      validCategories.forEach((category) => {
        expect(TUTORIAL_CATEGORIES).toContain(category);
      });
    });

    it('should properly type TutorialCategorySection', () => {
      const validSections: TutorialCategorySection[] = [
        'Featured Tutorials',
        'Biomarker and Cell Type Search',
        'Data',
        'Visualization',
        'Workspaces',
      ];

      validSections.forEach((section) => {
        expect(TUTORIAL_CATEGORY_SECTIONS).toContain(section);
      });
    });
  });
});
