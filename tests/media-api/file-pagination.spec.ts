import { test } from '@fixtures/base.extend';
import { expect } from '@playwright/test';

test.describe('Media API - File Pagination', () => {
  test.describe('files query with cursor pagination', () => {
    test('returns files with default pagination', async ({ api }) => {
      await api.session.setupUserAndProject();

      // Create a few files using fixture
      await api.admin.file.uploadFromUrl(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png',
      );
      await api.admin.file.uploadFromUrl(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/320px-Good_Food_Display_-_NCI_Visuals_Online.jpg',
      );

      const { data } = await api.admin.query('media/FilesFindMany', {
        variables: {},
      });

      expect(data.mediaQuery.files).toBeTruthy();
      expect(data.mediaQuery.files.edges).toBeInstanceOf(Array);
      expect(data.mediaQuery.files.edges.length).toBeGreaterThanOrEqual(2);
      expect(data.mediaQuery.files.pageInfo).toBeTruthy();
      expect(data.mediaQuery.files.totalCount).toBeGreaterThanOrEqual(2);
    });

    test('paginates forward with first/after', async ({ api }) => {
      await api.session.setupUserAndProject();

      // Create 5 files
      const files = [];
      for (let i = 0; i < 5; i++) {
        const file = await api.admin.file.uploadFromUrl(
          `https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/28${i}px-PNG_transparency_demonstration_1.png`,
        );
        files.push(file);
      }

      // Get first 2 files
      const { data: page1 } = await api.admin.query('media/FilesFindMany', {
        variables: { first: 2 },
      });

      expect(page1.mediaQuery.files.edges).toHaveLength(2);
      expect(page1.mediaQuery.files.pageInfo.hasNextPage).toBe(true);
      expect(page1.mediaQuery.files.pageInfo.endCursor).toBeTruthy();

      // Get next 2 files
      const { data: page2 } = await api.admin.query('media/FilesFindMany', {
        variables: {
          first: 2,
          after: page1.mediaQuery.files.pageInfo.endCursor,
        },
      });

      expect(page2.mediaQuery.files.edges).toHaveLength(2);
      expect(page2.mediaQuery.files.pageInfo.hasPreviousPage).toBe(true);

      // Verify no duplicates between pages
      const page1Ids = page1.mediaQuery.files.edges.map((e: { node: { id: string } }) => e.node.id);
      const page2Ids = page2.mediaQuery.files.edges.map((e: { node: { id: string } }) => e.node.id);
      const intersection = page1Ids.filter((id: string) => page2Ids.includes(id));
      expect(intersection).toHaveLength(0);
    });

    test('paginates backward with last/before', async ({ api }) => {
      await api.session.setupUserAndProject();

      // Create 5 files
      for (let i = 0; i < 5; i++) {
        await api.admin.file.uploadFromUrl(
          `https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/32${i}px-Good_Food_Display_-_NCI_Visuals_Online.jpg`,
        );
      }

      // Get all files first
      const { data: allFiles } = await api.admin.query('media/FilesFindMany', {
        variables: { first: 10 },
      });

      expect(allFiles.mediaQuery.files.edges.length).toBeGreaterThanOrEqual(5);

      // Get last 2 files before the last cursor
      const lastCursor = allFiles.mediaQuery.files.pageInfo.endCursor;
      const { data: lastPage } = await api.admin.query('media/FilesFindMany', {
        variables: {
          last: 2,
          before: lastCursor,
        },
      });

      expect(lastPage.mediaQuery.files.edges).toHaveLength(2);
      expect(lastPage.mediaQuery.files.pageInfo.hasPreviousPage).toBe(true);
    });

    test('returns empty list when no files exist', async ({ api }) => {
      await api.session.setupUserAndProject();
      // New project should have no files initially

      const { data } = await api.admin.query('media/FilesFindMany', {
        variables: { first: 10 },
      });

      expect(data.mediaQuery.files.edges).toHaveLength(0);
      expect(data.mediaQuery.files.totalCount).toBe(0);
      expect(data.mediaQuery.files.pageInfo.hasNextPage).toBe(false);
      expect(data.mediaQuery.files.pageInfo.hasPreviousPage).toBe(false);
    });

    test('edge contains cursor and node', async ({ api }) => {
      await api.session.setupUserAndProject();

      await api.admin.file.uploadFromUrl(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png',
      );

      const { data } = await api.admin.query('media/FilesFindMany', {
        variables: { first: 1 },
      });

      expect(data.mediaQuery.files.edges).toHaveLength(1);
      const edge = data.mediaQuery.files.edges[0];

      expect(edge.cursor).toBeTruthy();
      expect(typeof edge.cursor).toBe('string');
      expect(edge.node).toBeTruthy();
      expect(edge.node.id).toBeTruthy();
      expect(edge.node.provider).toBeTruthy();
    });

    test('pageInfo structure is correct', async ({ api }) => {
      await api.session.setupUserAndProject();

      await api.admin.file.uploadFromUrl(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png',
      );

      const { data } = await api.admin.query('media/FilesFindMany', {
        variables: { first: 1 },
      });

      const pageInfo = data.mediaQuery.files.pageInfo;

      expect(typeof pageInfo.hasNextPage).toBe('boolean');
      expect(typeof pageInfo.hasPreviousPage).toBe('boolean');
      // startCursor and endCursor can be null for empty results
      expect(pageInfo.startCursor === null || typeof pageInfo.startCursor === 'string').toBe(true);
      expect(pageInfo.endCursor === null || typeof pageInfo.endCursor === 'string').toBe(true);
    });

    test('totalCount reflects actual file count', async ({ api }) => {
      await api.session.setupUserAndProject();

      // Create 3 files
      for (let i = 0; i < 3; i++) {
        await api.admin.file.uploadFromUrl(
          `https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/32${i}px-Camponotus_flavomarginatus_ant.jpg`,
        );
      }

      const { data } = await api.admin.query('media/FilesFindMany', {
        variables: { first: 1 },
      });

      // totalCount should be at least 3 (we just created 3)
      expect(data.mediaQuery.files.totalCount).toBeGreaterThanOrEqual(3);

      // But we only requested 1
      expect(data.mediaQuery.files.edges).toHaveLength(1);
    });

    test('files are ordered by createdAt descending (newest first)', async ({ api }) => {
      await api.session.setupUserAndProject();

      // Create files with a small delay to ensure different timestamps
      const file1 = await api.admin.file.uploadFromUrl(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png',
      );

      // Small delay
      await new Promise((resolve) => setTimeout(resolve, 100));

      const file2 = await api.admin.file.uploadFromUrl(
        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/320px-Good_Food_Display_-_NCI_Visuals_Online.jpg',
      );

      const { data } = await api.admin.query('media/FilesFindMany', {
        variables: { first: 10 },
      });

      const edges = data.mediaQuery.files.edges;
      expect(edges.length).toBeGreaterThanOrEqual(2);

      // Find positions of our files
      const file1Index = edges.findIndex((e: { node: { id: string } }) => e.node.id === file1.id);
      const file2Index = edges.findIndex((e: { node: { id: string } }) => e.node.id === file2.id);

      // file2 should come before file1 (newer first) in descending order
      expect(file2Index).toBeLessThan(file1Index);
    });

    test('can fetch all pages sequentially', async ({ api }) => {
      await api.session.setupUserAndProject();

      // Create 5 files
      for (let i = 0; i < 5; i++) {
        await api.admin.file.uploadFromUrl(
          `https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/28${i}px-PNG_transparency_demonstration_1.png`,
        );
      }

      const allFileIds: string[] = [];
      let cursor: string | undefined;
      let hasMore = true;

      // Fetch 2 at a time until no more
      while (hasMore) {
        const { data } = await api.admin.query('media/FilesFindMany', {
          variables: {
            first: 2,
            ...(cursor ? { after: cursor } : {}),
          },
        });

        for (const edge of data.mediaQuery.files.edges) {
          allFileIds.push(edge.node.id);
        }

        hasMore = data.mediaQuery.files.pageInfo.hasNextPage;
        cursor = data.mediaQuery.files.pageInfo.endCursor;
      }

      // Should have fetched all files without duplicates
      const uniqueIds = [...new Set(allFileIds)];
      expect(uniqueIds.length).toBe(allFileIds.length);
      expect(allFileIds.length).toBeGreaterThanOrEqual(5);
    });
  });
});
