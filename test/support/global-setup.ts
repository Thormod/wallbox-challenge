// Set ENV variables
process.env.TYPEORM_PORT = '5432';

import { join, dirname } from 'path';
import npm from 'npm';
import util from 'util';
import * as dockerCompose from 'docker-compose';
import isPortReachable from 'is-port-reachable';
import { waitForPostgres } from '../test-helpers';
import isCI from 'is-ci';

export default async function setup(): Promise<void> {
  await isPortReachable(5432);

  // 🏃🏻‍♂️ Run docker
  await dockerCompose.upAll({
    cwd: join(dirname(__filename), './docker'),
    log: true,
  });

  // 😴 Wait for Postgres to be ready to accept connections
  await waitForPostgres();

  // 🏁 Apply DB migrations
  const npmLoadAsPromise = util.promisify(npm.load);
  await npmLoadAsPromise();
  const npmCommandAsPromise = util.promisify(npm.commands['run-script']);
  await npmCommandAsPromise(['typeorm', 'migration:run']);
}
