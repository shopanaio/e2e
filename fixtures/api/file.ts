import { APIRequestContext } from '@playwright/test';
import { GqlRequestSession } from './gqlRequest';
import fs from 'fs';
import path from 'path';

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

  /**
   * Upload local file (driver = LOCAL). Returns created file ID.
   */
  async createFromFile(filePath: string): Promise<string> {
    console.log('createFromFile',this.baseUrl, filePath);
    const endpoint = `${this.baseUrl}/v1/file/upload`;
    const { projectSlug, accessToken } = this.session;

    const absolutePath = path.isAbsolute(filePath) ? filePath : path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found: ${absolutePath}`);
    }

    const fileBuffer = fs.readFileSync(absolutePath);
    const fileName = path.basename(absolutePath);

    const response = await this.request.post(endpoint, {
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(projectSlug ? { 'X-PJ-Key': projectSlug } : {}),
      },
      multipart: {
        driver: 'S3',
        file: {
          name: fileName,
          mimeType: this.getMimeType(fileName),
          buffer: fileBuffer,
        },
      },
    });

    const json = await response.json();
    if (!json.id) {
      throw new Error(`Failed to upload file: ${JSON.stringify(json)}`);
    }
    return json.id as string;
  }

  /**
   * Get MIME type based on file extension.
   */
  private getMimeType(fileName: string): string {
    const ext = path.extname(fileName).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }
}
