import { test } from '@fixtures/base.extend';
import { seedProject } from '@data/seed-project';

test.describe('Seed Project', () => {
  test('Initialize project with test data', async ({ api }) => {
    const email = process.env.SEED_TENANT_EMAIL ?? '';
    const password = process.env.SEED_TENANT_PASSWORD ?? '';
    const projectSlug = process.env.SEED_PROJECT_SLUG ?? '';

    if (!email || !password || !projectSlug) {
      throw new Error(`Missing .env variables`);
    }

    await api.session.signIn(email, password);
    await api.session.pullProject(projectSlug);
    await seedProject(api.admin);
  });
});
