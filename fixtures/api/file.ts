import { APIRequestContext } from '@playwright/test';
import { GqlRequestSession } from './gqlRequest';

export class FileFixture {
  private readonly baseUrl: string;

  constructor(private request: APIRequestContext, private session: GqlRequestSession) {
    const restUrl = process.env.ADMIN_REST_URL;
    if (!restUrl) {
      throw new Error('ADMIN_REST_URL environment variable is not set');
    }
    this.baseUrl = restUrl.replace(/\/$/, '');
  }

  /**
   * Upload external file by URL (driver = URL). Returns created file ID.
   */
  async createFromURL(url: string): Promise<string> {
    const endpoint = `${this.baseUrl}/v1/file/upload`;
    const { projectSlug, accessToken } = this.session;

    const response = await this.request.post(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(projectSlug ? { 'X-PJ-Key': projectSlug } : {}),
      },
      data: { driver: 'URL', url },
    });

    const json = await response.json();
    if (!json.id) {
      throw new Error(`Failed to upload mock file: ${JSON.stringify(json)}`);
    }
    return json.id as string;
  }
}
