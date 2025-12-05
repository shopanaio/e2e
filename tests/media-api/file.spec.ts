import { test } from '@fixtures/base.extend';
import { expect } from '@playwright/test';

test.describe('Media API - File', () => {
  test('file resolver returns file data', async ({ api }) => {
    await api.session.setupUserAndProject();

    const testFileId = 'test-file-123';

    const { data } = await api.admin.query('media/FileFindOne', {
      variables: { id: testFileId },
    });

    expect(data).toBeTruthy();
    expect(data.mediaQuery).toBeTruthy();
    expect(data.mediaQuery.file).toBeTruthy();
    expect(data.mediaQuery.file.id).toBe(testFileId);
    expect(data.mediaQuery.file.provider).toBe('S3');
    expect(data.mediaQuery.file.url).toContain(testFileId);
    expect(data.mediaQuery.file.isProcessed).toBe(true);
  });
});
