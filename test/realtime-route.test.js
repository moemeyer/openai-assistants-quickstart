import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs/promises';
import path from 'path';

const routePath = path.join(process.cwd(), 'app', 'api', 'realtime', 'session', 'route.ts');

test('Realtime session route exists', async () => {
  try {
    await fs.access(routePath);
    assert.ok(true);
  } catch (err) {
    assert.fail('Realtime session route is missing');
  }
});
