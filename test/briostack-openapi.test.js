import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs/promises';
import path from 'path';

const specPath = path.join(process.cwd(), 'public', 'briostack-openapi.json');

test('Briostack OpenAPI spec should load', async () => {
  const data = await fs.readFile(specPath, 'utf8');
  const json = JSON.parse(data);
  assert.strictEqual(json.info.title, 'Briostack API');
});
